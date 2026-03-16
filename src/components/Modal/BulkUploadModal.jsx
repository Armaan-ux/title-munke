import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Download, Loader2, X } from "lucide-react";
import * as XLSX from "xlsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  bulkAgentUpload,
  bulkBrokerUpload,
  fetchBrokerInOrganisation,
} from "../service/userAdmin";
import { useUser } from "@/context/usercontext";
import { handleCreateAuditLog } from "@/utils";
import { useUserIdType } from "@/hooks/useUserIdType";

export default function BulkUploadModal({ open, onClose, type, onSuccess }) {
  const { user } = useUser();
  const { userType: currentUserType } = useUserIdType();
  const fileInputRef = useRef(null);
  const [selectedBroker, setSelectedBroker] = useState("");
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  const brokerQuery = useQuery({
    queryKey: ["brokers-in-org"],
    queryFn: fetchBrokerInOrganisation,
    enabled: open && type === "agent",
  });

  const bulkUploadMutation = useMutation({
    mutationFn: (data) =>
      type === "agent" ? bulkAgentUpload(data) : bulkBrokerUpload(data),
    onSuccess: async () => {
      toast.success(`${type === "agent" ? "Agents" : "Brokers"} added successfully`);
      onSuccess?.();
      await handleCreateAuditLog(
        "Bulk Upload",
        { detail: `Bulk ${type === "agent" ? "Agent" : "Broker"} Upload` },
        false,
        currentUserType
      );
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Bulk upload failed");
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (type === "agent" && !selectedBroker) {
      toast.error("Please select a broker");
      return;
    }

    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        if (type === "agent") {
          bulkUploadMutation.mutate({
            agents: json,
            brokerId: selectedBroker,
          });
        } else {
          bulkUploadMutation.mutate({
            brokers: json,
            organisationId: user.attributes.sub,
          });
        }
      } catch (error) {
        toast.error("Error parsing file");
        console.error(error);
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (!open) {
      setFile(null);
      setSelectedBroker("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  const brokers = Array.isArray(brokerQuery.data)
    ? brokerQuery.data
    : (brokerQuery.data?.items || brokerQuery.data?.brokers || []);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white border-none shadow-xl px-10 border-0 outline-0 ring-0">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-left text-secondary !font-poppins">
            Bulk Upload {type === "agent" ? "Agents" : "Brokers"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#6B5E55]">Step 1: Download Template</Label>
            <a
              href="https://title-search-storage.s3.us-east-1.amazonaws.com/Bulk+Upload+Template.xlsx"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" className="w-full h-11 border-[#E6DFDB] hover:bg-[#F5F0EC] flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download XLSX Template
              </Button>
            </a>
          </div>

          {type === "agent" && (
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-[#6B5E55]">Step 2: Select Broker</Label>
              <Select value={selectedBroker} onValueChange={setSelectedBroker}>
                <SelectTrigger className="w-full h-11 bg-white border border-[#E6DFDB]">
                  <SelectValue placeholder="Select a broker" />
                </SelectTrigger>
                <SelectContent>
                  {brokerQuery.isLoading ? (
                    <div className="p-2 text-center text-sm text-[#6B5E55]">
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2 text-tertiary" />
                      Loading...
                    </div>
                  ) : brokers.length === 0 ? (
                    <div className="p-2 text-center text-sm text-[#6B5E55]">
                      No brokers found.
                    </div>
                  ) : (
                    brokers.map((broker) => (
                      <SelectItem key={broker.brokerId} value={broker.brokerId}>
                        {broker.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#6B5E55]">
              {type === "agent" ? "Step 3: Upload File" : "Step 2: Upload File"}
            </Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xls,.xlsx"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                file ? "border-tertiary bg-tertiary/5" : "border-[#E6DFDB] hover:border-tertiary/50 bg-[#FBF9F8]"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold text-secondary">{file.name}</span>
                  <span className="text-xs text-muted-foreground mr-auto ml-auto px-2 py-1 bg-white rounded border border-[#E6DFDB]">Change File</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[#B6AAA5] mb-2" />
                  <span className="text-sm text-[#6B5E55]">Click to browse Excel file</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 h-11"
            disabled={bulkUploadMutation.isPending || isParsing}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-11"
            variant="secondary"
            onClick={handleUpload}
            disabled={!file || (type === "agent" && !selectedBroker) || bulkUploadMutation.isPending || isParsing}
          >
            {(bulkUploadMutation.isPending || isParsing) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
