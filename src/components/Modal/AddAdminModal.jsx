import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TEAMS } from "@/utils/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBrokerByAdminSchema, baseUserSchema, getAddAgentByAdminSchema } from "@/formSchema";
import { Controller, useForm } from "react-hook-form";
import { FormValidationError } from "../common/FormValidationError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { createUserByAdmin, getBrokerSelectListing, updateAgentDetail, updateBrokerDetail } from "../service/userAdmin";
import { toast } from "react-toastify";
import { useEffect } from "react";
const formSchemas = {
  admin: baseUserSchema,
  broker: addBrokerByAdminSchema,
};

const submitText = {
  agent: "Invite Agent",
  broker: "Invite Broker",
  admin: "Invite Admin",
};
const updateText = {
  agent: "Update Agent",
  broker: "Update Broker",
  admin: "Update Admin",
};


export default function AddAdminModal({ open, onClose,title, userType, invalidateFun, selectedUser }) {
  const {control, handleSubmit, reset, formState: { errors }} = useForm({
      defaultValues: { fullName: "", email: "", message: "", ...(userType === "agent" && {brokerId: ""}), ...(userType === "broker" && {teamStrength: ""}) },
      resolver: zodResolver(userType === "agent" ? (getAddAgentByAdminSchema(!!selectedUser?.id ? false : true)) : formSchemas[userType]),
    });

  const isUpdate = !!selectedUser?.id;

  useEffect(() => {
    if (isUpdate) {
      reset({
        fullName: selectedUser?.name || "",
        email: selectedUser?.email || "",
        message: selectedUser?.message || "",
        // ...(userType === "agent" && {brokerId: selectedUser?.brokerId || ""}),
        ...(userType === "broker" && {teamStrength: selectedUser?.teamStrength || ""}),
      });
    }
  }, [selectedUser, reset, isUpdate, userType]);
  const brokerListingQuery = useQuery({
    queryKey: [queryKeys?.brokerSelectListing],
    queryFn: getBrokerSelectListing,
    enabled: userType === "agent"
  })

  const newUserMutation = useMutation({
    mutationFn: (payload) => createUserByAdmin(payload),
    onSuccess: () => {
      reset();
      invalidateFun?.();
    }, 
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Something went wrong while adding new user. Please try again.");
    },
  });

  const updateBrokerMutation = useMutation({
    mutationFn: (payload) => updateBrokerDetail(payload),
    onSuccess: () => {
      invalidateFun?.();
      onClose();
    }, 
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Something went wrong while adding new user. Please try again.");
    },
  })

  const updateAgentMutation = useMutation({
    mutationFn: (payload) => updateAgentDetail(payload),
    onSuccess: () => {
      invalidateFun?.();
      onClose();
    }, 
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Something went wrong while adding new user. Please try again.");
    },
  })

  const onSubmit = ({fullName, ...rest}) => {
    if(isUpdate && userType === "broker") {
      const {email, teamStrength} = rest
      updateBrokerMutation?.mutate({email, teamStrength, name: fullName, id: selectedUser?.id});
    }
    else if(isUpdate && userType === "agent") {
      const {email} = rest
      updateAgentMutation?.mutate({email, name: fullName, id: selectedUser?.id});
    }
    else
      newUserMutation?.mutate({...rest, name: fullName, userType});
  }
  const updateLoading = updateAgentMutation?.isPending || updateBrokerMutation?.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white border-none shadow-xl px-10">

          <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-left text-secondary !font-poppins">
                {`${isUpdate ? "Update" : "Add"} ${title}`}
              </DialogTitle>
            </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block" htmlFor="fullName">Full Name</label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  id="fullName"
                  placeholder="John Marks"
                  className="h-[38px] bg-white border border-[#E6DFDB] text-secondary placeholder:text-[#B6AAA5] focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                />
              )}
            />
            {errors.fullName && <FormValidationError message={errors.fullName.message} />}
          </div>

          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block" htmlFor="email">Email Address</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  placeholder="john@emailaddress.com"
                  className="bg-white"
                  {...field}
                />
              )}
            />
            {errors.email && <FormValidationError message={errors.email.message} />}
          </div>

          {userType === "agent" && !isUpdate &&
            <div>
                <Label className="text-sm text-[#6B5E55] mb-1 block">
                  Select Broker
                </Label>
                <Controller 
                  name="brokerId"
                  control={control}
                  render={({field}) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="mt-1 w-full !h-11">
                        <SelectValue
                          placeholder="Select"
                          className="text-[#2c150f]"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(brokerListingQuery?.data?.Items ?? [])?.map((item, index) => (
                          <SelectItem key={index} value={item?.id}>
                            {item?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.brokerId && <FormValidationError message={errors.brokerId.message} />}
            </div>
          }

          {userType === "broker" &&
            <div>
                <Label className="text-sm text-[#6B5E55] mb-1 block">
                  Select Strength
                </Label>
                <Controller 
                  name="teamStrength"
                  control={control}
                  render={({field}) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="mt-1 w-full !h-11">
                        <SelectValue
                          placeholder="Select"
                          className="text-[#2c150f]"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {TEAMS.map((item, index) => (
                          <SelectItem key={index} value={item.toLowerCase()}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.teamStrength && <FormValidationError message={errors.teamStrength.message} />}
            </div>
          }

          {!isUpdate &&
            <div>
              <label className="text-sm text-[#6B5E55] mb-1 block" htmlFor="message">Message (Optional)</label>
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="message"
                    name="message"
                    rows={10}
                    {...field}
                  />
                )}
              />
            </div>
          }

          <div className="flex justify-end gap-3 pt-2 *:flex-1">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="lg"
              // className="border border-[#550000] bg-transparent text-[#550000] hover:bg-[#F5F0EC] w-[50%]"
              // className="w-full"
              >
              Cancel
            </Button>
            <Button
              disabled={newUserMutation.isPending || updateLoading}
              type="submit"
              variant="secondary"
              size="lg"
              // className="bg-[#550000] hover:bg-[#3D0000] text-white w-[50%]"
            >
              {isUpdate ? updateText[userType] : submitText[userType]}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
