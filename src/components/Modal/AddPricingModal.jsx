import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPricingSchema } from "@/formSchema";
import { Controller, useForm } from "react-hook-form";
import { FormValidationError } from "../common/FormValidationError";
import { useMutation } from "@tanstack/react-query";
import { createPrice } from "../service/userAdmin";
import { toast } from "react-toastify";

export default function AddPricingModal({ open, onClose, product, invalidateFun }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { amount: "", description: "", subscription: "" },
    resolver: zodResolver(addPricingSchema),
  });

  useEffect(() => {
    if (open) {
      reset({ amount: "", description: "", subscription: "" });
    }
  }, [open, reset]);

  const newPricingMutation = useMutation({
    mutationFn: (payload) => createPrice(payload),
    onSuccess: () => {
      invalidateFun?.();
      onClose();
      toast.success("Pricing added successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong while adding new pricing. Please try again."
      );
    },
  });

  console.log("product",product)
  const onSubmit = (data) => {
    const payload = {
      productId: product?.id,
      name: product?.name,
      amount: data.amount * 100,
      nickname: data.description, // using description as nickname or metadata
      description: data.description,
      billingPeriod: data.subscription,
    };
    newPricingMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white border-none shadow-xl px-10">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-left text-secondary !font-poppins">
            Add Price
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block" htmlFor="amount">
              Amount
            </label>
            <div className="flex border border-[#E6DFDB] rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#7a0c20]">
              <span className="px-3 flex items-center text-[13px] text-gray-500 border-r border-gray-200 bg-white select-none">
                $
              </span>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="flex-1 py-2 text-[13px] text-gray-700 bg-white outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                )}
              />
            </div>
            {errors.amount && <FormValidationError message={errors.amount.message} />}
          </div>

          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block" htmlFor="description">
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Enter pricing description..."
                  rows={3}
                  className="bg-white border-[#E6DFDB] focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                />
              )}
            />
            {errors.description && (
              <FormValidationError message={errors.description.message} />
            )}
          </div>

          <div>
            <Label className="text-sm text-[#6B5E55] mb-1 block">Subscription</Label>
            <Controller
              name="subscription"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1 w-full bg-white border-[#E6DFDB] focus-visible:ring-0">
                    <SelectValue placeholder="Select Subscription" className="text-[#2c150f]" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subscription && (
              <FormValidationError message={errors.subscription.message} />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 *:flex-1">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              disabled={newPricingMutation.isPending}
              type="submit"
              variant="secondary"
              size="lg"
            >
              Add Price
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
