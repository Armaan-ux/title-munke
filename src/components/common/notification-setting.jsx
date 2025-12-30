import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  emailPreferenceSearchComplete,
  emailPreferenceWeeklyReport,
  fetchEmailPreference,
} from "../service/userAdmin";
import { toast } from "react-toastify";

const QUERY_KEY = ["email-preference"];

const Notification = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchEmailPreference,
    onError: () => toast.error("Failed to fetch email preference"),
  });

  const preference = data?.data ?? {};

  const createPreferenceMutation = (mutationFn, fieldName) =>
    useMutation({
      mutationFn,
      onMutate: async (checked) => {
        await queryClient.cancelQueries({ queryKey: QUERY_KEY });

        const previousData = queryClient.getQueryData(QUERY_KEY);

        queryClient.setQueryData(QUERY_KEY, (old) => ({
          ...old,
          data: {
            ...old?.data,
            [fieldName]: checked,
          },
        }));

        return { previousData };
      },
      onError: (_err, _vars, context) => {
        queryClient.setQueryData(QUERY_KEY, context?.previousData);
        toast.error("Failed to update email preference");
      },
      onSuccess: () => {
        toast.success("Email preference updated successfully");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });

  const searchCompleteMutation = createPreferenceMutation(
    emailPreferenceSearchComplete,
    "emailPreferenceSearchComplete"
  );

  const weeklyReportMutation = createPreferenceMutation(
    emailPreferenceWeeklyReport,
    "emailPreferenceWeeklyReport"
  );

  return (
    <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full shadow-md">
      <form className="space-y-6 flex-1">
        <p className="text-xl font-medium mb-5">
          Choose how you'd like to receive notifications
        </p>

        <div className="flex flex-row gap-10 pt-5">
          <Label>Email me when a search is completed</Label>
          <Switch
            checked={!!preference.emailPreferenceSearchComplete}
            onCheckedChange={(checked) =>
              searchCompleteMutation.mutate(checked)
            }
            thumbColor="data-[state=unchecked]:bg-background data-[state=checked]:bg-tertiary"
            trackColor="data-[state=unchecked]:bg-[#F5F0EC] data-[state=checked]:bg-[#F5F0EC]"
          />
        </div>

        <div className="flex flex-row gap-10 pt-5">
          <Label>Send me a weekly usage summary</Label>
          <Switch
            checked={!!preference.emailPreferenceWeeklyReport}
            onCheckedChange={(checked) =>
              weeklyReportMutation.mutate(checked)
            }
            thumbColor="data-[state=unchecked]:bg-background data-[state=checked]:bg-tertiary"
            trackColor="data-[state=unchecked]:bg-[#F5F0EC] data-[state=checked]:bg-[#F5F0EC]"
          />
        </div>
      </form>
    </div>
  );
};

export default Notification;
