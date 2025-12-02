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
import { addAgentByAdminSchema, addBrokerByAdminSchema, baseUserSchema } from "@/formSchema";
import { Controller, useForm } from "react-hook-form";
import { FormValidationError } from "../common/FormValidationError";
const formSchemas = {
  admin: baseUserSchema,
  agent: addAgentByAdminSchema,
  broker: addBrokerByAdminSchema,
};
const submitText = {
  agent: "Invite Agent",
  broker: "Invite Broker",
  admin: "Invite Admin",
};
export default function AddAdminModal({ open, onClose,title, userType,  }) {
  const {control, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
      defaultValues: { fullName: "", email: "", message: "", ...(userType === "agent" && {brokerId: ""}), ...(userType === "broker" && {teamStrength: ""}) },
      resolver: zodResolver(formSchemas[userType]),
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white border-none shadow-xl px-10">

          <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-left text-secondary !font-poppins">
                {`Add ${title}`}
              </DialogTitle>
            </DialogHeader>

        <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-4">
          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block">Full Name</label>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="John Marks"
                  className="h-[38px] bg-white border border-[#E6DFDB] text-secondary placeholder:text-[#B6AAA5] focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...field}
                />
              )}
            />
            {errors.fullName && <FormValidationError message={errors.fullName.message} />}
          </div>

          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block">Email Address</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="john@emailaddress.com"
                  className="bg-white"
                  {...field}
                />
              )}
            />
            {errors.email && <FormValidationError message={errors.email.message} />}
          </div>

          {userType === "agent" &&
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
                        {TEAMS.map((item, index) => (
                          <SelectItem key={index} value={item.toLowerCase()}>
                            {item}
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

          <div>
            <label className="text-sm text-[#6B5E55] mb-1 block">Message (Optional)</label>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Textarea
                  name="message"
                  rows={10}
                  {...field}
                />
              )}
            />
          </div>

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
              disabled={isSubmitting}
              type="submit"
              variant="secondary"
              size="lg"
              // className="bg-[#550000] hover:bg-[#3D0000] text-white w-[50%]"
            >
              {submitText[userType]}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
