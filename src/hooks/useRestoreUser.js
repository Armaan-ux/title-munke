import { restoreUser } from "@/components/service/userAdmin";
import { useMutation } from "@tanstack/react-query";

export function useRestoreUser(onSuccess) {
    const restoreUserMutation = useMutation({
        mutationFn: (payload) => restoreUser(payload),
        onSuccess: () => onSuccess()
    })
    return {restoreUserMutation}
}