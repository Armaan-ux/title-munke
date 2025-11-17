import { convertFromTimestamp } from "@/utils";
import html2pdf from "html2pdf.js";
import { useState } from "react";

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const date = convertFromTimestamp(parseInt(Date.now() / 1000), "dateTime")
  const handleDownload = (ref) => {
    setIsDownloading(true)
    if (ref.current) {
      setTimeout(() => {
        html2pdf()
          .set({
            margin: 0,
            filename: "invoice-" + date,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          })
          .from(ref.current)
          .save();
          setIsDownloading(false)
      }, 300);
    }
  };

  return { handleDownload, isDownloading};
}