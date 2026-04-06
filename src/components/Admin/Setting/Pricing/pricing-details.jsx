import React, { useState } from "react";
import { Briefcase, Plus, Clock, Trash2, Loader2 } from "lucide-react";
import { convertUnixToLocalTime } from "@/utils/date";
import AddPricingModal from "@/components/Modal/AddPricingModal";
import { deactivePrice } from "@/components/service/userAdmin";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { PRICE_TYPES_BY_ROLE } from "@/utils/constant";
import { AgGridReact } from "ag-grid-react";

export default function PricingDetails({ data, invalidateFun, isPending }) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Helper function to get price type label
  const getPriceTypeLabel = (roleType, priceType) => {
    const priceTypesArray = PRICE_TYPES_BY_ROLE[roleType] || [];
    const priceTypeObj = priceTypesArray.find(
      (item) => item.value === priceType,
    );
    return priceTypeObj?.label || priceType || "-";
  };

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
          <div className="relative min-h-[150px]">
            {isPending ? (
              <div className="py-10">
                <Loader2 className="animate-spin text-[#7B4B3A] mx-auto" size={32} />
              </div>
            ) : (
              <div
                className="ag-theme-quartz custom-ag-grid"
                style={{ width: "100%" }}
              >
                <AgGridReact
                  rowData={data?.prices?.filter((price) => price.active) || []}
                  columnDefs={[
                    {
                      headerName: "Price",
                      field: "unit_amount",
                      valueGetter: (params) =>
                        `US$ ${params.data.unit_amount / 100}`,
                      flex: 1,
                      minWidth: 100,
                    },
                    {
                      headerName: "Description",
                      field: "nickname",
                      valueGetter: (params) => params.data.nickname || "-",
                      flex: 1.5,
                      minWidth: 150,
                      wrapText: true,
                      autoHeight: true,
                    },
                    {
                      headerName: "Price Type",
                      field: "metadata.priceType",
                      valueGetter: (params) =>
                        getPriceTypeLabel(
                          params.data.metadata?.roleType,
                          params.data.metadata?.priceType,
                        ),
                      flex: 1.5,
                      minWidth: 150,
                      wrapText: true,
                      autoHeight: true,
                    },
                    {
                      headerName: "Created",
                      field: "created",
                      valueGetter: (params) =>
                        convertUnixToLocalTime(params.data?.created),
                      flex: 1.5,
                      minWidth: 150,
                      wrapText: true,
                      autoHeight: true,
                    },
                    {
                      headerName: "Action",
                      field: "id",
                      width: 120,
                      minWidth: 120,
                      maxWidth: 120,
                      flex: 0,
                      sortable: false,
                      cellRenderer: (params) => (
                        <div className="flex items-center justify-end h-full">
                          <button
                            onClick={() =>
                              handleDeletePrice(
                                params.data?.id,
                                data?.product?.metadata?.productType,
                              )
                            }
                            disabled={deletingId === params.data?.id}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 flex items-center justify-center p-1 cursor-pointer transition-colors"
                            title="Delete Pricing"
                          >
                            {deletingId === params.data?.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    sortable: true,
                    resizable: true,
                    unSortIcon: true,
                    wrapHeaderText: true,
                    autoHeaderHeight: true,
                  }}
                  rowHeight={60}
                  headerHeight={56}
                  domLayout="autoHeight"
                  animateRows={true}
                  overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
                />
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="mt-6">
            <p className="font-semibold text-[#3A2F2F] mb-2">Description</p>
            <p className="text-sm text-[#7B6E65]">
              Powerful, customizable solutions built for large organizations,
              investors, and enterprise-scale operations.
            </p>
          </div>

          <hr className="my-6 border-[#EEE6DF]" />

          {/* Audit History */}
          <div>
            <p className="font-semibold text-[#3A2F2F] mb-4">Audit History</p>

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
                <p className="font-semibold text-[#3A2F2F]">Status</p>
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
              <p className="font-semibold text-[#3A2F2F] mb-4">Details</p>

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
