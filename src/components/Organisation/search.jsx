import {
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BrokerHistory from "@/components/Broker/broker-history";
import Search from "@/components/common/search";
import { useEffect, useState } from "react";
import { useUser } from "@/context/usercontext";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import {  getCheckCardIsAdded } from "../service/userAdmin";
import { useUserIdType } from "@/hooks/useUserIdType";

const OrganisationSearch = () => {
  const navigate = useNavigate();
  const { userId } = useUserIdType();

  const {  setPaymentModal, setCardListingModal, organisationDetail } =
    useUser();

 
  const { data: iscardAddedForUser } = useQuery({
    queryKey: [queryKeys.getCheckCardIsAdded],
    queryFn: () => getCheckCardIsAdded(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    const plan = organisationDetail?.planType;
    const isCardAdded = iscardAddedForUser?.isCardAdded;
    if (!plan || isCardAdded !== false) return;

    // store planType safely
    localStorage.setItem("planType", plan);

    let timer;

    if (plan === "PROFESSIONAL_PLAN") {
      timer = setTimeout(() => {
        setPaymentModal(true);
      }, 2000);
    } else if (plan === "PAY_AS_YOU_GO") {
      timer = setTimeout(() => {
        setCardListingModal(true);
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [organisationDetail?.planType, iscardAddedForUser?.isCardAdded]);

  return (
    <div className="my-4">
      {/* cards */}
      {/* <div className="grid grid-cols-2 md:grid-cols-3  gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4">
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Total Agents</p>
            <p className="text-4xl font-semibold text-tertiary">
              {totalAgents}
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <UserRound className="text-tertiary" />
          </div>
        </div>
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Active Agents</p>
            <p className="text-4xl font-semibold text-tertiary">
              {activeAgents}
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <UserRoundCheck className="text-tertiary" />
          </div>
        </div>
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Inactive Agents</p>
            <p className="text-4xl font-semibold text-tertiary">
              {inactiveAgents}
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <UserRoundX className="text-tertiary" />
          </div>
        </div>
      </div> */}




      {/* Search */}
      <Search />

      <div className="bg-[#F5F0EC] p-6 rounded-2xl ">
        <div className="flex justify-between items-center gap-4 mb-6">
          <p className="text-secondary font-medium text-xl">Search History</p>
          <Link to="/broker/dashboard/search-history">
            <Button variant="outline"> View More </Button>
          </Link>
        </div>

        <BrokerHistory />
      </div>

      {/* {memberModal && (
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
      {paymentSuccessModal && (
        <SubscriptionSuccessModal
          open={paymentSuccessModal}
          onOpenChange={() => setPaymentSuccessModal(false)}
          onFailed={() => setPaymentFailedModal(true)}
        />
      )}
      {true && (
        <CardAddedSuccessModal
          open={true}
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
    </div>
  );
};

export default OrganisationSearch;
