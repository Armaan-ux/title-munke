import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { createPrice, createProduct } from "../service/userAdmin";

// ── Reusable chevron icon ──────────────────────────────────────────────────
function Chevron({ size = 12, color = "#6b7280" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── Select wrapper with absolute chevron ───────────────────────────────────
function SelectWrap({ children }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <Chevron />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ProductModal({ open, onClose, activeTab }) {
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [taxCode, setTaxCode] = useState(null);

  console.log("taxCode", taxCode);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      amount: "",
      pricing: "recurring",
      includeTax: "auto",
      billingPeriod: "monthly",
      statementDescriptor: "",
      unitLabel: "",
    },
  });

  const pricingType = watch("pricing");
  const amount = watch("amount");

  const parsed = parseFloat(amount) || 0;
  const tax = parsed * 0.06;
  const total = parsed + tax;

  const fmt = (n) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleError = (error) => {
    console.log("error", error);
    setError("Something went wrong. Please try again later.");
  };

  const handleSuccess = () => {
    onClose();
    resetformHandler();
  };

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      console.log("data ---------------------------  createProduct", data);

      // createPriceMutation.mutate({
      //   productId: data.id,
      //   name: data.name,
      //   metaData: data.metaData,
      //   pricingType: data.pricingType,
      //   amount: data.amount,
      //   currency: data.currency,
      //   billingPeriod: data.billingPeriod,
      //   taxBehavior: data.taxBehavior,
      //   nickname: data.nickname,
      // });
    },
    onError: handleError,
  });

  const createPriceMutation = useMutation({
    mutationFn: createPrice,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  // const onSubmit = (data) => console.log("Submit", data);

  const onSubmit = (data) => {
    console.log("data", data);

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("taxCode", taxCode || "");
    formData.append("amount", data.amount * 100);
    formData.append("pricing", data.pricing);
    formData.append("includeTax", data.includeTax || "");
    formData.append("billingPeriod", data.billingPeriod || "");
    formData.append("statementDescriptor", data.statementDescriptor || "");
    formData.append("unitLabel", data.unitLabel || "");

    // FormData cannot take object directly
    formData.append("metadata", JSON.stringify({ roleType: activeTab?.id }));

    // if (data.imageUrl) {
    //   formData.append("imageUrl", data.imageUrl);
    // }

    createProductMutation.mutate(formData);
  };

  const resetformHandler = () => {
    reset();
    setImagePreview(null);
    setError(null);
    setTaxCode(null);
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={() => {
        onClose();
        resetformHandler();
      }}
    >
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70" />

        {/* Modal shell */}
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white rounded-2xl overflow-hidden"
          style={{
            width: "calc(100vw - 48px)",
            maxWidth: "880px",
            maxHeight: "calc(100vh - 48px)",
          }}
        >
          {/* ══ HEADER — full width ══ */}
          <div className="flex items-center justify-between px-7 py-5 bg-white flex-shrink-0">
            <p className="text-xl font-medium text-tertiary">Create Product</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ══ BODY — left form + right preview ══ */}
          <div className="flex flex-1 overflow-hidden ">
            {/* ── LEFT: scrollable form ── */}
            <div className="flex-1 overflow-y-auto px-7 pb-6 flex flex-col border-t border-gray-200">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2 flex-1"
              >
                {/* NAME */}
                <div>
                  <Label className="block text-[13px] font-medium text-gray-800 my-4">
                    Name (required)
                  </Label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        placeholder="Name of the product or service, visible to customers."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7a0c20]/30 focus:border-[#7a0c20] transition-colors bg-white"
                      />
                    )}
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <Label className="block text-[13px] font-medium text-gray-800 mb-1">
                    Description
                  </Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        placeholder="Appears at checkout, on the customer portal, and in quotes."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-700 placeholder-gray-400 outline-none resize-none focus:ring-2 focus:ring-[#7a0c20]/30 focus:border-[#7a0c20] transition-colors bg-white"
                      />
                    )}
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <Label className="block text-[13px] font-medium text-gray-800 mb-1">
                    Image
                  </Label>

                  <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <div className="border border-gray-200 rounded-lg bg-[#faf7f5] flex flex-col items-center justify-center py-5">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          id="productImageUpload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                              onChange(file); // react-hook-form value
                              setImagePreview(URL.createObjectURL(file)); // preview
                            }
                          }}
                        />

                        <label
                          htmlFor="productImageUpload"
                          className="border border-gray-300 bg-white rounded-md px-4 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          Upload file
                        </label>

                        {/* Image Preview */}
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="preview"
                            className="mt-3 h-24 w-24 object-cover rounded-md border"
                          />
                        )}

                        <p className="text-[11px] text-gray-400 mt-2">
                          Appears at checkout. JPEG, PNG, or WEBP under 2MB.
                        </p>
                      </div>
                    )}
                  />
                </div>

                {/* PRODUCT TAX CODE */}
                <div>
                  <Label className="block text-[13px] font-medium text-gray-800 mb-1">
                    Product tax code
                  </Label>

                  <Controller
                    name="taxCode"
                    control={control}
                    render={({ field }) => (
                      <SelectWrap>
                        <select
                          {...field}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-[13px] text-gray-700 bg-white appearance-none outline-none cursor-pointer focus:ring-2 focus:ring-[#7a0c20]/30 focus:border-[#7a0c20]"
                        >
                          <option value="">
                            Use preset: General - Electronically Supplied
                            Services
                          </option>

                          <option value="digital_services">
                            Digital Services
                          </option>

                          <option value="software">Software</option>

                          <option value="saas">SaaS</option>
                        </select>
                      </SelectWrap>
                    )}
                  />
                </div>

                {/* PRICING TOGGLE */}
                <div>
                  <Label className="block text-[13px] font-medium text-gray-800 mb-2">
                    Pricing
                  </Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setValue("pricing", "recurring")}
                      className={`px-8 py-2 rounded-lg text-sm w-full font-medium cursor-pointer transition-colors border
                        ${
                          pricingType === "recurring"
                            ? "bg-[#7a0c20] text-white border-[#7a0c20]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      Recurring
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("pricing", "oneoff")}
                      className={`px-8 py-2 rounded-lg text-sm w-full font-medium cursor-pointer transition-colors border
                        ${
                          pricingType === "oneoff"
                            ? "bg-[#7a0c20] text-white border-[#7a0c20]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      One-off
                    </button>
                  </div>
                </div>

                {/* AMOUNT */}
                <div>
                  <Label className="block text-[13px] font-medium text-gray-800 mb-1">
                    Amount (required)
                  </Label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#7a0c20]/30 focus-within:border-[#7a0c20]">
                    <span className="px-3 flex items-center text-[13px] text-gray-500 border-r border-gray-200 bg-white select-none">
                      $
                    </span>
                    <Controller
                      name="amount"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="flex-1 px-3 py-2 text-[13px] text-gray-700 bg-white outline-none"
                        />
                      )}
                    />
                    <div className="relative border-l border-gray-200">
                      <select className="h-full pl-2.5 pr-6 text-[13px] text-gray-700 bg-white border-0 outline-none cursor-pointer appearance-none">
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
                        <Chevron size={10} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* INCLUDE TAX */}
                <div>
                  <Label className="block text-[13px] font-medium text-gray-800 mb-1">
                    Include tax in price
                  </Label>

                  <Controller
                    name="includeTax"
                    control={control}
                    defaultValue="auto"
                    render={({ field }) => (
                      <SelectWrap>
                        <select
                          {...field}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-[13px] text-gray-700 bg-white appearance-none outline-none cursor-pointer focus:ring-2 focus:ring-[#7a0c20]/30 focus:border-[#7a0c20]"
                        >
                          <option value="auto">Auto</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </SelectWrap>
                    )}
                  />
                </div>

                {/* BILLING PERIOD */}
                {pricingType === "recurring" && (
                  <div>
                    <Label className="block text-[13px] font-medium text-gray-800 mb-1">
                      Billing period
                    </Label>

                    <Controller
                      name="billingPeriod"
                      control={control}
                      defaultValue="monthly"
                      render={({ field }) => (
                        <SelectWrap>
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-[13px] text-gray-700 bg-white appearance-none outline-none cursor-pointer focus:ring-2 focus:ring-[#7a0c20]/30 focus:border-[#7a0c20]"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                          </select>
                        </SelectWrap>
                      )}
                    />
                  </div>
                )}

                {/* MORE PRICING OPTIONS */}
                <button
                  type="button"
                  className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700 bg-transparent border-0 cursor-pointer p-0 self-start"
                >
                  More pricing options <Chevron size={10} />
                </button>

                {/* Spacer */}
                <div className="flex-1 border-b border-[#e5d5cc] pt-2" />

                {/* FOOTER BUTTONS */}
                <div className="flex justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="border border-gray-300 px-5  rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#7a0c20] text-white border-0 px-6  rounded-lg text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    Add Product
                  </Button>
                </div>
              </form>
            </div>

            {/* ── RIGHT: Preview panel ── */}
            <div className="w-64 min-w-[330px]  pt-0 pr-5 pb-6   ">
              <div className="h-full bg-[#f5ede8] p-5 border border-[#e5d5cc] ">
                <p className="text-md  font-semibold text-secondary mb-2">
                  Preview
                </p>
                <p className="text-xs text-primary mb-5 leading-relaxed">
                  Estimate totals based on pricing model, unit quantity, and
                  tax.
                </p>

                {/* Product tax code */}
                <div className="mb-3.5">
                  <p className="text-xs font-medium text-secondary mb-1.5">
                    Product tax code
                  </p>
                  <input
                    type="text"
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="Tax Code"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-tertiary/10 focus:border-[#7a0c20] transition-colors bg-white"
                  />
                </div>

                {/* Location */}
                <div className="mb-3.5">
                  <p className="text-[11px] font-medium text-secondary mb-1.5">
                    Location
                  </p>

                  <SelectWrap>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-xs text-gray-700 bg-[#ece5e0] appearance-none outline-none cursor-pointer">
                      <option>United States (Head office address)</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </SelectWrap>
                </div>

                {/* State */}
                <div className="mb-5 border-b border-[#d8ccc6] pb-5">
                  <p className="text-[11px] font-medium text-secondary mb-1.5">
                    State
                  </p>

                  <SelectWrap>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 bg-[#ece5e0] appearance-none outline-none cursor-pointer">
                      <option>Pennsylvania</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </SelectWrap>
                </div>

                {/* Qty line */}
                <p className="text-[13px] text-primary mb-4">
                  2 × ${fmt(parsed)} = <strong>${fmt(parsed * 2)}</strong>
                </p>

                {/* Totals */}
                <div className="border-t border-[#d8ccc6] pt-3.5 flex flex-col gap-2">
                  {[
                    { lbl: "Subtotal", val: fmt(parsed), bold: false },
                    { lbl: "Sales tax 6%", val: fmt(tax), bold: false },
                    { lbl: "Total per month", val: fmt(total), bold: true },
                  ].map(({ lbl, val, bold }) => (
                    <div
                      key={lbl}
                      className={`flex justify-between text-[13px] ${bold ? "font-bold text-secondary" : "text-secondary"}`}
                    >
                      <span>{lbl}</span>
                      <span>${val}</span>
                    </div>
                  ))}
                  <p className="text-[11px] text-secondary mt-0.5">
                    Billed at the start of the period
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* end BODY */}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
