import React, { useState } from "react";
import { Briefcase, Plus, Clock } from "lucide-react";
import { convertUnixToLocalTime } from "@/utils/date";
import AddPricingModal from "@/components/Modal/AddPricingModal";

export default function PricingDetails({ data, invalidateFun }) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <div className="w-full bg-[#F5EFEA] p-6 rounded-lg mt-6">
      {/* Title */}
      <p className="text-xl font-semibold text-[#3A2F2F] mb-6">
        Pricing Details
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="col-span-2 bg-white rounded-lg p-6 border border-[#E6DED6]">
          {/* Plan Header */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="bg-[#F1E6DE] p-3 rounded-md">
                <Briefcase size={20} className="text-[#7B4B3A]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#3C2F2F]">
                  {data?.productDetails?.name}
                </h3>
                <p className="text-sm text-[#8A7F76]">
                  {`${data?.prices?.unit_amount / 100} / Search Cost`}
                </p>
              </div>
            </div>

            <button onClick={() => setIsPricingModalOpen(true)} className="flex items-center gap-2 border border-[#E3D9CF] px-3 py-2 rounded-md text-sm text-[#5C4E46] hover:bg-[#F8F4F1] cursor-pointer">
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
          <div className="rounded-md overflow-hidden border border-[#ECE4DC]">
            <div className="grid grid-cols-4 bg-[#F2EAE3] text-sm font-medium text-[#6C5E55] p-3">
              <div>Price</div>
              <div>Description</div>
              <div>Subscription</div>
              <div>Created</div>
            </div>
            {data?.prices?.length > 0 &&
              <div className="max-h-60 overflow-y-auto">
              {data?.prices?.map((prices, index) => {
                return (
                  <div key={index} className="grid grid-cols-4 text-sm p-3 text-[#5E534A]">
                    <div>{`US$ ${prices?.unit_amount / 100}`}</div>
                    <div>{prices?.nickname}</div>
                    <div>-</div>
                    <div>{convertUnixToLocalTime(prices?.created)}</div>
                  </div>
                );
              })}
              </div>
            }
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
                {`Plan updated on ${convertUnixToLocalTime(data?.productDetails?.updated)}`}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14} />
                {`Plan created on ${convertUnixToLocalTime(data?.productDetails?.created)}`}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={14} />
                {`Pricing table updated on ${convertUnixToLocalTime(data?.productDetails?.updated)}`}
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
                  {data?.product?.active ? "Active" : "Inactive"}
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
                  <p className="text-[#4F433C]">{data?.product?.id}</p>
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
      />
    </div>
  );
}
