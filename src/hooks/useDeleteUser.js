import { deleteUserNew } from "@/components/service/userAdmin";
import { useMutation } from "@tanstack/react-query";

export function useDeleteUser(onSuccess) {
    const deleteUserMutation = useMutation({
        mutationFn: (payload) => deleteUserNew(payload),
        onSuccess: () => onSuccess()
    })
    return {deleteUserMutation}
}