import { PopcornIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export function DeleteAlert({ isOpen, onClose, onDelete, message }) {
    <Alert>
        <PopcornIcon variant="destructive"/>
        <AlertTitle>
            {message || "Are you sure you want to perform action?"}
        </AlertTitle>
        <AlertDescription>
          <Button>Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </AlertDescription>
    </Alert>
}