import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

function ShowError({ message = "Something went wrong." }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}

export default ShowError;
