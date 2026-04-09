import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newAgentSchema } from "@/formSchema";
import { FormValidationError } from "../common/FormValidationError";
import { createAgentForBroker } from "../service/agent";
import { toast } from "react-toastify";
import { useUser } from "@/context/usercontext";
import { handleCreateAuditLog } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { updateAgentDetail } from "../service/userAdmin";
export default function AddAgentByBrokerModal({
  open,
  onOpenChange,
  setUser,
  selectedUser,
  invalidateFun,
}) {
  const { user } = useUser();
  const { userId } = useUserIdType();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", searchLimit: 10 },
    resolver: zodResolver(newAgentSchema),
  });

  const isUpdate = !!selectedUser?.id;
  useEffect(() => {
    if (isUpdate) {
      reset({
        name: selectedUser?.agentName || "",
        email: selectedUser?.email || "",
        searchLimit: selectedUser?.searchLimit || "",
      });
    }
  }, [selectedUser, reset, isUpdate]);

  const updateAgentMutation = useMutation({
    mutationFn: (payload) => updateAgentDetail(payload),
    onSuccess: () => {
      onOpenChange();
      invalidateFun();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong while adding new user. Please try again.",
      );
    },
  });

  const onSubmit = async (data) => {
    try {
      const { name, email, searchLimit } = data;
      if (isUpdate) {
        updateAgentMutation.mutate({
          name,
          email,
          searchLimit,
          id: selectedUser?.id,
        });
        return;
      }
      const response = await createAgentForBroker(
        userId,
        name,
        email,
        searchLimit,
      );
      toast.success("Agent Created Successfully.");
      const newAgent = response.user;
      console.log("newAgent", newAgent);
      setUser((prev) => [
        ...prev,
        { ...newAgent, totalSearches: 0, agentName: name },
      ]);

      const userGroups =
        user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
      if (userGroups.includes("broker")) {
        handleCreateAuditLog("AGENT_CREATE", {
          detail: `Broker has created the agent`,
        });
      }
      reset();
      onOpenChange();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    }
  };
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[420px] rounded-2xl py-5  px-8 bg-white shadow-xl border-none"
        overlayClass="bg-black/40 backdrop-blur-[1px]"
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-[26px] text-secondary font-semibold !font-poppins">
            {isUpdate ? "Update Agent" : "Add Agent"}
          </DialogTitle>
          <DialogClose className="text-secondary hover:bg-transparent focus:outline-none">
            <X className="h-5 w-5 text-bold" />
          </DialogClose>
        </DialogHeader>

        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit((data) => onSubmit(data))}
        >
          <div className="space-y-1">
            <label className="text-[14px] font-medium text-secondary">
              Full Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="John Marks"
                  className="h-[38px] bg-white border border-[#E6DFDB] text-secondary placeholder:text-[#B6AAA5] focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                />
              )}
            />
            {errors.name && (
              <FormValidationError message={errors.name.message} />
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[14px] font-medium text-secondary">
              Email Address
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="John Marks"
                  className="h-[38px] bg-white border border-[#E6DFDB] text-secondary placeholder:text-[#B6AAA5] focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isUpdate}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <FormValidationError message={errors.email.message} />
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[14px] font-medium text-secondary">
              Monthly Search Limit
            </label>
            <Controller
              name="searchLimit"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-[38px] w-full border border-[#E6DFDB] text-secondary focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>

                  <SelectContent className="text-secondary">
                    {[10, 20, 30, 50, 100].map((limit) => (
                      <SelectItem key={limit} value={limit}>
                        {limit}
                      </SelectItem>
                    ))}
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* <div className="flex items-center space-x-2 pt-1">
            <Checkbox id="activate" />
            <label
              htmlFor="activate"
              className="text-[13px] text-secondary font-medium leading-none cursor-pointer"
            >
              Activate this agent immediately
            </label>
          </div> */}

          <div className="flex justify-end gap-3 pt-3 ">
            <Button
              variant="outline"
              className="h-[38px] w-[50%] px-5 border border-[#4C0D0D] text-[#4C0D0D] text-[14px] font-medium rounded-md hover:bg-[#4C0D0D]/5"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-[38px] w-[50%] px-5 bg-[#4C0D0D] hover:bg-[#4C0D0D]/90 text-white text-[14px] font-medium rounded-md"
              disabled={isSubmitting || updateAgentMutation?.isPending}
            >
              {isUpdate ? "Update Agent" : "Invite Agent"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
