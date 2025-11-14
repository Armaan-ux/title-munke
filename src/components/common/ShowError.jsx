import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

function ShowError({ message="Something went wrong." }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export default ShowError;
