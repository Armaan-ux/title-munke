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

  // Fetch preferences
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchEmailPreference,
    onError: () => toast.error("Failed to fetch email preference"),
  });

  // Safe default values
  const preference = {
    emailPreferenceSearchComplete:
      data?.data?.emailPreferenceSearchComplete ?? false,
    emailPreferenceWeeklyReport:
      data?.data?.emailPreferenceWeeklyReport ?? false,
  };

  // Search Complete Mutation
  const searchCompleteMutation = useMutation({
    mutationFn: emailPreferenceSearchComplete,
    onMutate: async (checked) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousData = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, (old) => ({
        ...old,
        data: {
          ...old?.data,
          emailPreferenceSearchComplete: checked,
        },
      }));

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEY, context.previousData);
      }
      toast.error("Failed to update search completion preference");
    },
    onSuccess: () => {
      toast.success("Search completion preference updated");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  // Weekly Report Mutation
  const weeklyReportMutation = useMutation({
    mutationFn: emailPreferenceWeeklyReport,
    onMutate: async (checked) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousData = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, (old) => ({
        ...old,
        data: {
          ...old?.data,
          emailPreferenceWeeklyReport: checked,
        },
      }));

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEY, context.previousData);
      }
      toast.error("Failed to update weekly report preference");
    },
    onSuccess: () => {
      toast.success("Weekly report preference updated");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 w-full shadow-md">
        <p className="text-lg">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full shadow-md">
      <form className="space-y-6 flex-1">
        <p className="text-xl font-medium mb-5">
          Choose how you'd like to receive notifications
        </p>

        {/* Search Completed */}
        <div className="flex flex-row justify-flex-start items-center gap-10 pt-5">
          <Label>Email me when a search is completed</Label>
          <Switch
            checked={preference.emailPreferenceSearchComplete}
            onCheckedChange={(checked) =>
              searchCompleteMutation.mutate(checked)
            }
            disabled={searchCompleteMutation.isPending}
            thumbColor="data-[state=unchecked]:bg-background data-[state=checked]:bg-tertiary"
            trackColor="data-[state=unchecked]:bg-[#F5F0EC] data-[state=checked]:bg-[#F5F0EC]"
          />
        </div>

        {/* Weekly Summary */}
        <div className="flex flex-row justify-flex-start items-center gap-10 pt-5">
          <Label>Send me a weekly usage summary</Label>
          <Switch
            checked={preference.emailPreferenceWeeklyReport}
            onCheckedChange={(checked) => weeklyReportMutation.mutate(checked)}
            disabled={weeklyReportMutation.isPending}
            thumbColor="data-[state=unchecked]:bg-background data-[state=checked]:bg-tertiary"
            trackColor="data-[state=unchecked]:bg-[#F5F0EC] data-[state=checked]:bg-[#F5F0EC]"
          />
        </div>
      </form>
    </div>
  );
};

export default Notification;
