import React, { useState } from "react";
import { Briefcase, Plus, Clock, Trash2, Loader2 } from "lucide-react";
import { convertUnixToLocalTime } from "@/utils/date";
import AddPricingModal from "@/components/Modal/AddPricingModal";
import { deactivePrice } from "@/components/service/userAdmin";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function PricingDetails({ data, invalidateFun, isPending }) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const deleteUserMutation = useMutation({
    mutationFn: ({ priceId, productType }) =>
      deactivePrice(priceId, productType),
    onSuccess: () => {
      toast.success("Pricing deleted successfully");
      invalidateFun?.();
      setDeletingId(null);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete pricing");
      setDeletingId(null);
    },
  });

  const handleDeletePrice = (priceId, productType) => {
    setDeletingId(priceId);
    deleteUserMutation.mutate({ priceId, productType });
  };

  return (
    <div className="w-full bg-[#F5EFEA] p-6 rounded-lg mt-6">
      {/* Title */}
      <p className="text-xl font-semibold text-[#3A2F2F] mb-6">
        Pricing Details
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-lg p-6 border border-[#E6DED6]">
          {/* Plan Header */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="bg-[#F1E6DE] p-3 rounded-md">
                <Briefcase size={20} className="text-[#7B4B3A]" />
              </div>
              {/* 
              <div>
                <h3 className="font-semibold text-[#3C2F2F]">
                  {data?.productDetails?.name}
                </h3>
                <p className="text-sm text-[#8A7F76]">
                  {`${data?.prices?.unit_amount / 100} / Search Cost`}
                </p>
              </div> */}
            </div>

            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="flex items-center gap-2 border border-[#E3D9CF] px-3 py-2 rounded-md text-sm text-[#5C4E46] hover:bg-[#F8F4F1] cursor-pointer whitespace-nowrap"
            >
              <Plus size={14} />
              Add Price
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-[#7A6E65] mt-4">
            Pricing plan with exclusive benefits, discounted pricing, and
            priority access.
          </p>

          <hr className="my-6 border-[#EEE6DF]" />

          {/* Pricing Table */}
          <div className="rounded-md border border-[#ECE4DC] overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-5 bg-[#F2EAE3] text-sm font-medium text-[#6C5E55] p-3">
                <div>Price</div>
                <div>Description</div>
                <div>Subscription</div>
                <div>Created</div>
                <div className="text-right">Action</div>
              </div>
              {data?.prices === undefined ? (
                <div className="p-8 flex justify-center items-center">
                  <Loader2 className="animate-spin text-[#7B4B3A]" size={24} />
                </div>
              ) : data?.prices?.filter((prices) => prices.active)?.length >
                0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {data?.prices
                    ?.filter((prices) => prices.active)
                    ?.map((prices, index) => {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-5 items-center text-sm p-3 text-[#5E534A] border-b border-[#ECE4DC] last:border-0"
                        >
                          <div>{`US$ ${prices?.unit_amount / 100}`}</div>
                          <div>{prices?.nickname || "-"}</div>
                          <div>-</div>
                          <div>{convertUnixToLocalTime(prices?.created)}</div>
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                handleDeletePrice(
                                  prices?.id,
                                  data?.product?.metadata?.productType,
                                )
                              }
                              disabled={deletingId === prices?.id}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50 flex items-center justify-center p-1 cursor-pointer transition-colors"
                              title="Delete Pricing"
                            >
                              {deletingId === prices?.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-[#7A6E65]">
                  No pricing available for this product.
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-6">
            <h4 className="font-semibold text-[#3A2F2F] mb-2">Description</h4>
            <p className="text-sm text-[#7B6E65]">
              Powerful, customizable solutions built for large organizations,
              investors, and enterprise-scale operations.
            </p>
          </div>

          <hr className="my-6 border-[#EEE6DF]" />

          {/* Audit History */}
          <div>
            <h4 className="font-semibold text-[#3A2F2F] mb-4">Audit History</h4>

            <div className="space-y-3 text-sm text-[#6F635A]">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                {`Plan updated on ${convertUnixToLocalTime(data?.product?.updated)}`}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14} />
                {`Plan created on ${convertUnixToLocalTime(data?.product?.created)}`}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14} />
                {`Pricing table updated on ${convertUnixToLocalTime(data?.product?.updated)}`}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg p-5 border border-[#E6DED6] h-full">
            <div className=" bg-[#F1E6DE] p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-[#3A2F2F]">Status</h4>
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                  ) : data?.product?.active ? (
                    "Active"
                  ) : (
                    "Inactive"
                  )}
                </div>
              </div>

              <p className="text-sm text-[#7B6E65]">
                {`  Start on ${convertUnixToLocalTime(data?.product?.created)}`}
              </p>
            </div>

            {/* Details Card */}
            <div className="border border-[#F1E6DE] p-3 rounded-md mt-6">
              <h4 className="font-semibold text-[#3A2F2F] mb-4">Details</h4>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[#8A7F76]">Product ID</p>
                  <p className="text-[#4F433C] break-all">
                    {data?.product?.id}
                  </p>
                </div>

                <div>
                  <p className="text-[#8A7F76]">Product tax code</p>
                  <p className="text-[#4F433C]">
                    {/* General – Electronically Supplied Services
                  <br /> */}
                    {data?.product?.tax_code}
                  </p>
                </div>

                <div>
                  <p className="text-[#8A7F76]">Marketing feature list</p>
                  <p>-</p>
                </div>

                <div>
                  <p className="text-[#8A7F76]">Attributes</p>
                  <p>-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddPricingModal
        open={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        product={data?.product}
        invalidateFun={invalidateFun}
        metadata={data?.product?.metadata}
      />
    </div>
  );
}
