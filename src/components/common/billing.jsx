import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardContent } from "@/components/ui/card";
import { useUser } from "@/context/usercontext";
import PaymentMethodModal from "@/components/Modal/PaymentMethodModal";
import SubscriptionSuccessModal from "@/components/Modal/SubscriptionSuccessModal";
import SubscriptionFailedModal from "@/components/Modal/SubscriptionFailedModal";
import { useNavigate } from "react-router-dom";
import { SubscriptionCanceledSuccessModal } from "../Modal/SubscriptionCanceledSuccessModal";
import { CancelSubscriptionModal } from "../Modal/CancelSubscriptionModal";
import { HelpUsImproveModal } from "../Modal/HelpUsImproveModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelSubscription, getSubscriptionDetails } from "../service/userAdmin";
import { CenterLoader } from "./Loader";
import ShowError from "./ShowError";
import { convertFromTimestamp } from "@/utils";
import { useUserIdType } from "@/hooks/useUserIdType";
import { toast } from "react-toastify";

const Billing = () => {

  const navigate = useNavigate();
  const [cancleSubscriptionSucessModal, setCancleSubscriptionSucessModal] = useState(false);
  const [cancleSubscriptionModal, setCancleSubscriptionModal] = useState(false);
  const [helpUsImproveModal, setHelpUsImproveModal] = useState(false);
  const {
    user,
    setCardListingModal
  } = useUser();

  const userType = user?.signInUserSession?.idToken?.payload['cognito:groups']?.[0];
  const queryClient = useQueryClient();
  const {userId,userType: userRole} = useUserIdType();
  const subcriptionDetailQuery = useQuery({
    queryKey: ["subcription-details"],
    queryFn: () => getSubscriptionDetails(user?.attributes?.sub, userType),
    enabled: !!user?.attributes?.sub && !!userType,
  })
  const cancelSubscriptionMutation = useMutation({
    mutationFn: (reason) => cancelSubscription(userId, userType, user?.cancel_at_period_end ? false : true, reason=""),
    onSuccess: (data) => {
      if(!user?.cancel_at_period_end) {
        setCancleSubscriptionModal(false);
        setHelpUsImproveModal(false);
      } else
        toast.success(data?.message)
      queryClient.invalidateQueries({queryKey: ["subcription-details"]})
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? "Something went wrong.")
    }
  })
  const cardDetail = subcriptionDetailQuery?.data?.payment_methods?.[0] || {};
  return (
    <>
      <CancelSubscriptionModal
        open={cancleSubscriptionModal}
        onClose={() => setCancleSubscriptionModal(false)}
        onHelpUsImprove={() => setHelpUsImproveModal(true)}
      />
      <HelpUsImproveModal
        open={helpUsImproveModal}
        onClose={() => setHelpUsImproveModal(false)}
        onSubmit={() => setCancleSubscriptionSucessModal(true)}
        cancelSubscriptionMutation={cancelSubscriptionMutation}
        />
      <SubscriptionCanceledSuccessModal
        open={cancleSubscriptionSucessModal}
        onClose={() => setCancleSubscriptionSucessModal(false)}
      />
      {/* {paymentModal && (
        <PaymentMethodModal
          open={paymentModal}
          onOpenChange={() => setPaymentModal(false)}
          onSuccess={() => setPaymentSuccessModal(true)}
          isAddCard={true}
        />
      )}
      {paymentSuccessModal && (
        <SubscriptionSuccessModal
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
      )} */}
      <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full h-content shadow-md">
        {subcriptionDetailQuery?.isLoading && <CenterLoader />}
        {subcriptionDetailQuery?.isError && <ShowError message={"Subscription required to access this feature."}/>}
        {subcriptionDetailQuery?.isSuccess &&
          <CardContent className="w-full space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-secondary !font-poppins">
                Current Plan
              </h2>
            </div>

            <div className="grid grid-cols-3 border border-gray-200 rounded-xl overflow-hidden items-start *:h-full">
              <div className="p-8 bg-coffee-bg-billing-foreground border-r border-coffee-bg-billing-foreground-50">
                <p className="text-sm text-coffee-text-billing font-medium uppercase">
                  Plan
                </p>
                <p className="text-base text-secondary font-medium mt-1">
                 {subcriptionDetailQuery.data.planType?.replaceAll("_", " ")}
                </p>
              </div>

              <div className="p-8 bg-coffee-bg-billing-foreground border-r border--coffee-bg-billing-foreground-50 border-l border-coffee-bg-billing-foreground-200">
                <p className="text-sm text-coffee-text-billing font-medium uppercase ">
                  Billing Cycle
                </p>
                { subcriptionDetailQuery?.data?.planType && ["PAY_AS_YOU_GO_PLAN", "EXPLORE_PLAN", "NO_ACTIVE_PLAN"]?.includes(subcriptionDetailQuery.data.planType) ? 
                  <p className="text-base text-secondary font-medium mt-1">
                    None
                  </p> 
                  :
                  <p className="text-base font-semibold text-gray-900 mt-1 mb-4">
                    Monthly
                  </p>
                }
                {/* <button className="text-sm text-secondary  font-medium mt-1 hover:underline">
                  Switch to annual plan
                </button> */}
              </div>

              <div className="p-8 bg-coffee-bg-billing-foreground  border-l border-coffee-bg-billing-foreground-200 flex flex-col ">
                <p className="text-sm text-coffee-text-billing font-medium uppercase mb-1">
                  Billing Cycle
                </p>
                <div className="flex items-center justify-between text-sm text-gray-700">
                { subcriptionDetailQuery?.data?.planType && ["PAY_AS_YOU_GO_PLAN", "EXPLORE_PLAN", "NO_ACTIVE_PLAN"]?.includes(subcriptionDetailQuery.data.planType) ? 
                <p className="text-base text-secondary font-medium mt-1">
                    None
                  </p> 
                  :
                  <>
                    <div>
                      <p className="font-semibold">Monthly</p>
                      <p className="text-secondary  font-medium text-xs">
                        {convertFromTimestamp(subcriptionDetailQuery?.data?.previousBillingDate, "monthDateYear")}
                      </p>  
                    </div>
                    <span className="mx-2 text-secondary font-medium">↔</span>
                    <div>
                      <p className="font-semibold">Next Billing</p>
                      <p className="text-secondary font-medium text-xs">
                        {convertFromTimestamp(subcriptionDetailQuery?.data?.nextBillingDate, "monthDateYear")}
                      </p>
                    </div>
                  </>
                  }

                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-secondary !font-poppins">
                Billing Details
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-md uppercase text-coffee-text-billing font-medium">
                    PAYMENT METHOD
                  </p>
                  <div className="flex items-center space-x-3">
                    <img
                      src="/mastercard-icon.svg"
                      alt="Visa"
                      className="w-8 h-8"
                    />
                    <div className="flex gap-4">
                      <p className="ttext-secondary font-semibold">
                        {/* {subcriptionDetailQuery?.data?.customerName}  */}
                        <span className="tracking-widest">**** {cardDetail?.last4}</span>
                      </p>
                      <p className="text-sm text-coffee-text-billing font-medium">
                        Expire {`${cardDetail?.exp_month}`?.padStart(2, "0")}/{cardDetail?.exp_year}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-sm text-[#5A0A0A] hover:underline"
                    onClick={() => setCardListingModal(true)}
                  >
                    + Add Payment Method
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-md uppercase text-coffee-text-billing font-medium">
                    Billing Contact
                  </p>
                  <p className="text-sm text-secondary font-medium mt-1 mr-92">
                    {subcriptionDetailQuery?.data?.customerName}
                  </p>
                  <p className="text-sm text-gray-900 font-medium mt-1"></p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-md uppercase text-coffee-text-billing font-medium">
                    Invoice History
                  </p>
                  <button
                    className="text-sm text-secondary font-medium mt-1 hover:underline mr-90"
                    onClick={() => userRole==="broker" ? navigate("/broker/setting/billing-history") : userRole==="organisation" ? navigate("/organisation/setting/billing-history") : navigate("/agent/setting/billing-history")}
                  >
                    View
                  </button>
                  <button className="text-sm text-[#5A0A0A] mt-1 hover:underline"></button>
                </div>
              </div>
            </div>

            {/* <Separator className="my-2" /> */}

            {/* <div className="flex justify-between items-center text-sm text-coffee-light font-medium">
              <p>
                Cancel subscription will remain active until the end of the
                current billing period.
              </p>
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  className={`${user?.cancel_at_period_end ? "text-chart-2 hover:text-chart-2" :
                    "text-subscriptions hover:text-subscriptions"} hover:bg-transparent`}
                  onClick={() => {
                    if(user?.cancel_at_period_end) {
                      cancelSubscriptionMutation.mutate("");
                      return;
                    }
                    setCancleSubscriptionModal(true)
                  }}
                  disabled={cancelSubscriptionMutation?.isPending}
                >
                  {user?.cancel_at_period_end ? "Subscribe Again" : "Cancel Subscription"}
                </Button>
                {user?.cancel_at_period_end && <div><span className="text-coffee-text-billing font-medium">Plan expires at</span> {convertFromTimestamp(user?.cancel_at, "dateTime")}</div>}
              </div>
            </div> */}
          </CardContent>
        }
      </div>
    </>
  );
};

export default Billing;
