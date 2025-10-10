import React from 'react'
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';

const Notification = () => {
  return (
      <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full h-[78vh] shadow-md">
          <form className="space-y-6 flex-1">
            <div className="mb-5">
              <p className="text-xl font-medium">Choose how you'd like to receive notifications</p>
            </div>
            <div className="flex flex-row gap-10 pt-5 mb-2">
              <Label htmlFor="current-password" className="">
                Email me when a search is completes 
              </Label>
                <Switch
            id="email-switch"
            thumbColor="data-[state=unchecked]:bg-background data-[state=checked]:bg-tertiary"
            trackColor="data-[state=unchecked]:bg-[#F5F0EC] data-[state=checked]:bg-[#F5F0EC]"
          />
            </div>

            <div className="flex flex-row gap-10 pt-5 mb-2">
              <Label htmlFor="new-password" className="">
               Send me a weekly usage summary
              </Label>
                         <Switch
            id="email-weekly"
            thumbColor="data-[state=unchecked]:bg-background data-[state=checked]:bg-tertiary"
            trackColor="data-[state=unchecked]:bg-[#F5F0EC] data-[state=checked]:bg-[#F5F0EC]"
          />
            </div>
          </form>
        </div>
  )
}

export default Notification