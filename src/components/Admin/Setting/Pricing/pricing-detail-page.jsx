import React from "react";
import BackBtn from "@/components/back-btn";
import PricingDetailsHeader from "./pricing-details-header";
import PricingDetails from "./pricing-details";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { useParams } from "react-router-dom";
import { productDetails } from "@/components/service/userAdmin";

export default function PricingDetailPage() {
  const { id } = useParams();
  const { userId } = useUserIdType();
  const productDetailsQuery = useQuery({
    queryKey: [queryKeys.pricingListing],
    queryFn: () => productDetails(id),
    enabled: !!userId,
    keepPreviousData: true,
  });

  console.log("productDetailsQuery", productDetailsQuery?.data);
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
      </div>
      <PricingDetailsHeader
        isPending={productDetailsQuery?.isPending || productDetailsQuery?.isFetching}
        product={productDetailsQuery?.data?.product}
      />
      <PricingDetails
        data={productDetailsQuery?.data}
        invalidateFun={productDetailsQuery.refetch}
        isPending={productDetailsQuery?.isPending || productDetailsQuery?.isFetching}
      />
    </>
  );
}
