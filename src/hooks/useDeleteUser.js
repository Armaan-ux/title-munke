import { deleteUserNew } from "@/components/service/userAdmin";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useDeleteUser(onSuccess) {
    const deleteUserMutation = useMutation({
        mutationFn: (payload) => deleteUserNew(payload),
        onSuccess: () => {
            toast.success("Record deleted successfully.");
            if (onSuccess) onSuccess();
        }
    })
    return {deleteUserMutation}
}