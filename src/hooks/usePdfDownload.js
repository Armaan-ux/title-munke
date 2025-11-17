import html2pdf from "html2pdf.js";

export function usePdfDownload() {

    const handleDownload = (ref) => {
    if (ref.current) {
      html2pdf()
        .set({
          margin: 0,
          filename: "invoice",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(ref.current)
        .save();
    }
  };

  return {handleDownload}
}