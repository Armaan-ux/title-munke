import Papa from "papaparse";
export const useDownloadCsv = () => {
  const downloadCSV = (data) => {
    const csv = Papa.unparse(data);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    link.click();
  };
  return { downloadCSV}
};
