import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

export function ChangePlanModal({
  open,
  onClose,
  onChangeSubscription,

}) {
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[400px] rounded-2xl bg-white p-6 shadow-lg text-center "
        >
          <DialogHeader>
            <h2 className="text-lg font-semibold text-secondary mb-2 text-center !font-poppins">
              Ready to Change Your Plan?
            </h2>
            <Separator className="bg-[#e0c9c9]" />
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
           You’re about to switch plans. Shall we continue?
          </p>

          <DialogFooter className="flex justify-between gap-2">
            <Button
              className="text-xs bg-[#581b1b] text-white hover:bg-[#6b1e1e] w-[50%]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-xs border border-[#e0b4b4] text-[#c63c3c] hover:bg-[#fff1f1] w-[50%]"
              onClick={() => {
                  onChangeSubscription()
                onClose();
              }}
            >
              Yes, Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}
