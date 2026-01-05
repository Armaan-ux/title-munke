import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { useMutation } from "@tanstack/react-query";
import { changeDefaultAiModel } from "../service/chat";
import { toast } from "react-toastify";

export default function OtherSetting({aiModels=[], selectedModel=""}) {
  const [defaultAiModel, setDefaultAiModel] = useState("");
  const changeDefaultAiModelMutation = useMutation({
    mutationFn: () => changeDefaultAiModel(defaultAiModel),
    onSuccess: () => {
      toast.success("Default AI Model changed successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to change Default AI Model");
    }
  })

  return (
    <div className="bg-white rounded-xl px-8 py-8 w-full shadow-md">
      <p className="text-xl font-medium">Change AI Model</p>
      <Separator className="my-5" />
      <div>
        <Select
          value={selectedModel || defaultAiModel}
          onValueChange={(value) => {setDefaultAiModel(value); changeDefaultAiModelMutation.mutate();}}
          required
          disabled={changeDefaultAiModelMutation.isPending}
        >
          <SelectTrigger className="!h-12 border-[#BEA999] rounded-lg min-w-[156px] w-full md:w-[50%]">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            {aiModels.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
            {aiModels.length === 0 && (
              <div className="p-4 text-center text-secondary italic">
                No AI Models available
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
