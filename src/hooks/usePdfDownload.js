import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const usePdfDownload = () => {
  const handleDownload = async (id) => {
    const pdf = new jsPDF("p", "mm", "a4");

    setTimeout(async () => {
      const element = document.getElementById(id);
      if (!element) return;

      // Temporarily expand the container to include hidden content
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;
      element.style.height = element.scrollHeight + "px";
      element.style.overflow = "visible";

      const canvas = await html2canvas(element, {
        scale: 2, // keep quality
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Restore original styles
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL("image/png", 1.0);

      // Page settings
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 10; // left & right margin
      const marginY = 10; // top margin

      // Calculate image width/height keeping aspect ratio
      const imgWidth = pageWidth - marginX * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = marginY;

      // Add first page
      pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight - marginY;

      // Add remaining pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + marginY;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight - marginY;
      }

      // Save the PDF
      pdf.save("report.pdf");
    }, 300);
  };

  return { handleDownload };
};
