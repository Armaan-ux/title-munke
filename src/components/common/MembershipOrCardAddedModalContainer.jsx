import { useUser } from "@/context/usercontext";
import BecomeMemberModal from "../Modal/BecomeMemberModal";
import PaymentMethodModal from "../Modal/PaymentMethodModal";
import SubscriptionSuccessModal from "../Modal/SubscriptionSuccessModal";
import CardAddedSuccessModal from "../Modal/CardAddedSuccessModal";
import SubscriptionFailedModal from "../Modal/SubscriptionFailedModal";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function MembershipOrCardAddedModalContainer() {
  const { pathname } = useLocation();
  console.log("location", pathname);
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
  } = useUser();
  const { userType } = useUserIdType();
  const [searchParams] = useSearchParams();
  const isCardAdded = searchParams.get("isCardAdded");
  const isPaymentSuccessful = searchParams.get("isPaymentSuccessful");

  useEffect(() => {
    if (isCardAdded || isPaymentSuccessful) {
      setPaymentModal(false);
      setPaymentSuccessModal(true);
      setUser((pre) => ({ ...pre, isAddCard: true }));
      // setTimeout(() => setPaymentSuccessModal(false), 3000)
    }
  }, [isCardAdded, isPaymentSuccessful]);

  if (!["individual", "broker"].includes(userType)) return null;
  return (
    <div>
      {memberModal && userType === "broker" && (
        <BecomeMemberModal
          open={memberModal}
          onClose={() => setMemberModal(false)}
          setPaymentModal={setPaymentModal}
        />
      )}
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
