import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the record.",
  isLoading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold text-coffee-light mb-1">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-coffee-light text-600 mb-5 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#5A0A0A] text-white hover:bg-destructive/90"
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteModal;
