import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function BackBtn() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-left gap-2">
      <Button
        onClick={() => navigate(-1)}
        className="hover:!bg-coffee-bg-foreground"
        variant="ghost"
        // className=""
      >
        <ChevronLeft className="w-6 h-6 mr-1" />
        Back
      </Button>
    </div>
  );
}   