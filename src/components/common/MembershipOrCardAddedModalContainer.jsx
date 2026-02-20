import { useUser } from "@/context/usercontext";
import BecomeMemberModal from "../Modal/BecomeMemberModal";
import PaymentMethodModal from "../Modal/PaymentMethodModal";
import SubscriptionSuccessModal from "../Modal/SubscriptionSuccessModal";
import CardAddedSuccessModal from "../Modal/CardAddedSuccessModal";
import SubscriptionFailedModal from "../Modal/SubscriptionFailedModal";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Dialog } from "../ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Card } from "../ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteStripeCard, getSubscriptionDetails, markDefaultPaymentMethod } from "../service/userAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { CenterLoader } from "./Loader";

function MembershipOrCardAddedModalContainer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    user,
    setUser,
    memberModal,
    setMemberModal,
    setPaymentModal,
    paymentModal,
    setPaymentSuccessModal,
    paymentSuccessModal,
    setPaymentFailedModal,
    paymentFailedModal,
    cardListingModal, 
    setCardListingModal
  } = useUser();

  
  const queryClient = useQueryClient();
  const { userId,userType } = useUserIdType();
  const [searchParams] = useSearchParams();
  const isCardAdded = searchParams.get("isCardAdded");
  const isPaymentSuccessful = searchParams.get("isPaymentSuccessful");
  
  const subcriptionDetailQuery = useQuery({
    queryKey: ["subcription-details"],
    queryFn: () => getSubscriptionDetails(userId, userType),
    enabled: cardListingModal && !!userId
  })


  const markDefaultCardMutation = useMutation({
    mutationFn: (pmId) => markDefaultPaymentMethod(pmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcription-details"] });
      toast.success("Default card marked successfully");
    },
    onError: () => {
      toast.error("Failed to mark default card");
    }
  })


  const deleteCardMutation = useMutation({
    mutationFn: (pmId) => deleteStripeCard(pmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcription-details"] });
      // setCardListingModal(false);
      toast.success("Card deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete card");
    }
  })


  useEffect(() => {
    if (isCardAdded || isPaymentSuccessful) {
      setPaymentModal(false);
      setPaymentSuccessModal(true);
      setUser((pre) => ({ ...pre, isAddCard: true }));
      const id = setTimeout(() => {
        navigate(pathname, { replace: true });
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isCardAdded, isPaymentSuccessful, setUser, setPaymentModal, setPaymentSuccessModal, navigate, pathname]);

  if (!["individual", "broker"].includes(userType)) return null;
  const cards = subcriptionDetailQuery?.data?.payment_methods ?? [];
console.log("cardListingModal",cardListingModal)
  return (
    <div>
      {cardListingModal && 
        <Dialog open={cardListingModal} onOpenChange={() => {setCardListingModal(false); setUser((pre) => ({ ...pre, isAddCard: false }));}}>
          <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
          <DialogContent className="relative w-[400px] rounded-2xl p-0 border-none overflow-visible bg-transparent z-50">
            <RadioGroup
                // value={0}
                onValueChange={(pmId) => markDefaultCardMutation.mutate(pmId)}
                defaultValue={cards?.find(c => c.isDefault)?.id}
                className="space-y-3 bg-white px-4 py-8 rounded-md max-h-[500px] overflow-y-auto "
              >
                {/* <Card className="flex flex-row items-center justify-between px-5 py-3 rounded-xl border hover:border-gray-400 transition">
                  <div className="flex items-center gap-3">
                    <img src="/apple-pay.svg" alt="apple pay" />
                    <span className="font-medium">Apple Pay</span>
                  </div>
                  <RadioGroupItem value="apple" />
                </Card>

                <Card className="flex flex-row items-center justify-between px-5 py-3 rounded-xl border hover:border-gray-400 transition">
                  <div className="flex items-center gap-3">
                    <img src="/pp-logo.svg" alt="paypal" />
                    <span className="font-medium">Paypal</span>
                  </div>
                  <RadioGroupItem value="paypal" />
                </Card> */}

                {
                  (deleteCardMutation?.isPending || subcriptionDetailQuery?.isLoading || markDefaultCardMutation?.isPending) &&
                  <div className="absolute inset-0 w-full h-full backdrop-blur-xs z-50">
                  <CenterLoader className="m-auto" />
                </div>
                }

                {cards?.map((value, ind) => (
                  <div className="flex items-center justify-center gap-2" key={ind}>
                  <Card className="flex flex-row items-center justify-between px-5 py-3 rounded-xl border hover:border-gray-400 transition w-[85%]">
                    <div className="flex items-center gap-3">
                      <img
                        src="/mc-card.svg"
                        alt="card"
                        className="w-10 h-15 object-contain"
                      />
                      <span className="tracking-widest font-medium">
                        •••• •••• •••• {value?.last4}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={value?.id} />
                    </div>
                  </Card>
                  {
                    cards?.length > 1 &&
                    <div className="flex items-center justify-between gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger>
                           <Button variant="ghost" size="icon" >
                            <Trash2 className="w-4 h-4 text-secondary cursor-pointer" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="!font-poppins" >Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              // disabled={deleteCardMutation.isPending}
                              onClick={() => deleteCardMutation.mutate(value?.id)}
                              variant="secondary"
                              >
                              Continue
                              </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                   
                  </div>
                  }
                </div>
                ))}
                <Button
                    className="text-sm text-secondary bg-[#FDF6EE] hover:underline hover:bg-secondary hover:text-primary-foreground"
                    onClick={() => {setPaymentModal(true); setCardListingModal(false); setUser((pre) => ({ ...pre, isAddCard: true }));}}
                  >
                    + Add New Credit / Debit Card
                  </Button>
              </RadioGroup>
          </DialogContent>
          </div>
        </Dialog>
      }
      {/* {memberModal && userType === "broker" && (
        <BecomeMemberModal
          open={memberModal}
          onClose={() => setMemberModal(false)}
          setPaymentModal={setPaymentModal}
        />
      )} */}
      {paymentModal && (
        <PaymentMethodModal
          open={paymentModal}
          onOpenChange={() => setPaymentModal(false)}
          onSuccess={() => setPaymentSuccessModal(true)}
        />
      )}
      {paymentSuccessModal && isPaymentSuccessful && (
        <SubscriptionSuccessModal
          open={paymentSuccessModal}
          onOpenChange={() => setPaymentSuccessModal(false)}
          onFailed={() => setPaymentFailedModal(true)}
        />
      )}
      {paymentSuccessModal && isCardAdded && (
        <CardAddedSuccessModal
          open={paymentSuccessModal}
          onOpenChange={() => setPaymentSuccessModal(false)}
          onFailed={() => setPaymentFailedModal(true)}
        />
      )}

      {paymentFailedModal && (
        <SubscriptionFailedModal
          open={paymentFailedModal}
          onOpenChange={() => setPaymentFailedModal(false)}
        />
      )}
    </div>
  );
}

export default MembershipOrCardAddedModalContainer;
