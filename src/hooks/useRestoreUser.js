import { restoreUser } from "@/components/service/userAdmin";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useRestoreUser(onSuccess) {
    const restoreUserMutation = useMutation({
        mutationFn: (payload) => restoreUser(payload),
        onSuccess: () => {
            toast.success("Record restored successfully.");
            if (onSuccess) onSuccess();
        }
    })
    return {restoreUserMutation}
}