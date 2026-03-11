import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductModal({ open, onClose }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      amount: "",
      taxCode: "2",
      location: "United States (Head office address)",
      state: "Pennsylvania",
      pricing: "recurring",
      billingPeriod: "monthly",
    },
  });

  const pricingType = watch("pricing");
  const amount = watch("amount");

  const onSubmit = (data) => {
    console.log("Form Data", data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden">

        <div className="flex">

          {/* LEFT SECTION */}
          <div className="flex-1 p-8">

            <DialogHeader className="flex flex-row justify-between items-center mb-6">
              <DialogTitle className="text-xl font-semibold">
                Create Product
              </DialogTitle>

              <button
                onClick={onClose}
                className="text-gray-500 text-xl hover:text-black"
              >
                ✕
              </button>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* NAME */}
              <div>
                <label className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </label>

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Name of the product or service, visible to customers."
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium">Description</label>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows="3"
                      placeholder="Appears at checkout, on the customer portal, and in quotes."
                      className="w-full border rounded-lg px-3 py-2 mt-1 resize-none"
                    />
                  )}
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="text-sm font-medium">Image</label>

                <div className="border border-dashed rounded-lg p-6 text-center mt-2 bg-[#f8f5f3]">
                  <button
                    type="button"
                    className="border px-4 py-1 rounded-md text-sm bg-white"
                  >
                    Upload file
                  </button>

                  <p className="text-xs text-gray-500 mt-2">
                    Appears at checkout. JPEG, PNG, or WEBP under 2MB.
                  </p>
                </div>
              </div>

              {/* TAX CODE */}
              <div>
                <label className="text-sm font-medium">Product tax code</label>

                <select className="w-full border rounded-lg px-3 py-2 mt-1">
                  <option>
                    Use preset: General - Electronically Supplied Services
                  </option>
                </select>
              </div>

              {/* PRICING */}
              <div>
                <label className="text-sm font-medium">Pricing</label>

                <div className="flex mt-2 border rounded-lg overflow-hidden w-[320px]">

                  <button
                    type="button"
                    onClick={() => setValue("pricing", "recurring")}
                    className={`flex-1 py-2 text-sm ${
                      pricingType === "recurring"
                        ? "bg-tertiary text-white"
                        : "bg-white"
                    }`}
                  >
                    Recurring
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue("pricing", "oneoff")}
                    className={`flex-1 py-2 text-sm ${
                      pricingType === "oneoff"
                        ? "bg-tertiary text-white"
                        : "bg-white"
                    }`}
                  >
                    One-off
                  </button>

                </div>
              </div>

              {/* AMOUNT */}
              <div>
                <label className="text-sm font-medium">
                  Amount <span className="text-red-500">*</span>
                </label>

                <div className="flex border rounded-lg mt-1 overflow-hidden">

                  <span className="px-3 flex items-center text-gray-500">
                    $
                  </span>

                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="0.00"
                        className="flex-1 px-2 py-2 outline-none"
                      />
                    )}
                  />

                  <select className="px-2 border-l">
                    <option>USD</option>
                  </select>

                </div>
              </div>

              {/* TAX */}
              <div>
                <label className="text-sm font-medium">
                  Include tax in price
                </label>

                <select className="w-full border rounded-lg px-3 py-2 mt-1">
                  <option>Auto</option>
                </select>
              </div>

              {/* BILLING PERIOD */}
              <div>
                <label className="text-sm font-medium">Billing period</label>

                <select className="w-full border rounded-lg px-3 py-2 mt-1">
                  <option>Monthly</option>
                </select>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  className="border px-5 py-2 rounded-lg"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-tertiary text-white px-6 py-2 rounded-lg"
                  disabled={isSubmitting}
                >
                  Add Product
                </button>

              </div>

            </form>
          </div>

          {/* RIGHT PREVIEW PANEL */}
          <div className="w-[300px] bg-[#f6f1ed] p-6 border-l">

            <h3 className="font-semibold mb-1">Preview</h3>

            <p className="text-xs text-gray-500 mb-5">
              Estimate totals based on pricing model, unit quantity, and tax.
            </p>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-gray-500">Product tax code</p>
                <p>2</p>
              </div>

              <div>
                <p className="text-gray-500">Location</p>
                <p>United States</p>
              </div>

              <div>
                <p className="text-gray-500">State</p>
                <p>Pennsylvania</p>
              </div>

              <div className="border-t pt-3 mt-3 space-y-1">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${amount || "0.00"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Sales tax 6%</span>
                  <span>$0.00</span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total per month</span>
                  <span>${amount || "0.00"}</span>
                </div>

                <p className="text-xs text-gray-400">
                  Billed at the start of the period
                </p>

              </div>
            </div>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}