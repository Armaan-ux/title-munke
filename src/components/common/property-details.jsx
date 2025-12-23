import { ChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BackBtn from "../back-btn";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { getSearchedStatus } from "../service/userAdmin";
import { format } from "date-fns-tz";
import { CenterLoader } from "./Loader";
import ShowError from "./ShowError";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
const PropertyDetails = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const {downloadCSV} = useDownloadCsv()
  const propertyDetailQuery = useQuery({
  queryKey: [queryKeys?.propertyDetail, id],
  queryFn: () => getSearchedStatus(id),
  refetchInterval: (query) => {
    return query?.state?.data?.status === "In Progress"
      ? 5000 // poll every 5 seconds
      : false; // stop polling
  },
  enabled: !!id,
});
if(propertyDetailQuery?.isLoading) return <CenterLoader />
if(propertyDetailQuery?.isError) return <ShowError message={propertyDetailQuery?.error?.response?.data?.message} />
const pdfDocuments = propertyDetailQuery?.data?.documents?.filter(item => item?.type === "pdf") ?? [];

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
        {/* <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-lg text-secondary">Back</p>
        </div> */}
      </div>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-2xl mb-1 font-semibold text-[#4C0D0D]">
                  {propertyDetailQuery?.data?.address}, {propertyDetailQuery?.data?.propertySummary?.property_information_and_current_ownership?.county_and_state}
                </p>
                <p className="text-sm text-[#8B8686] mt-1">
                  Searched on:
                  <span className="font-semibold text-[#4C0D0D]">
                   {propertyDetailQuery?.data?.propertySummary?.["Date of Search"]}
                  </span>
                  | Reference ID:
                  <span className="font-semibold text-[#4C0D0D]">
                    SR-230145(pending)
                  </span>
                </p>
              </div>
              <Badge  className={`${
                  propertyDetailQuery?.data?.status === "SUCCESS"
                    ? "bg-[#E9F3E9] text-[#1E8221]"
                    : propertyDetailQuery?.data?.status === "Unconfirmed"
                    ? "bg-[#FFF3D9] text-[#A2781E]"
                    : "bg-[#FFE3E2] text-[#FF5F59]"} text-[13px] font-medium px-3 py-1 rounded-md`}>
                {propertyDetailQuery?.data.status}
              </Badge>
            </div>

             <Separator />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 opacity-25">
              <div>
                <p className="font-semibold text-lg text-[#4C0D0D] mb-2">
                  Description
                </p>

                <div className="grid grid-cols-3 gap-8 text-sm text-[#4C0D0D]">
                  <div>
                    <p className="font-semibold uppercase text-sm">Location</p>
                    <p className="text-[#7A7676]">
                     {propertyDetailQuery?.data?.propertySummary?.property_information_and_current_ownership?.property_information}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-sm">Lots</p>
                    <p className="text-[#7A7676]">#91 (W 34 ft), #92 (all)</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-sm">Area</p>
                    <p className="text-[#7A7676]">Allentown, Lehigh County</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-sm">Property</p>
                    <p className="text-[#7A7676]">{propertyDetailQuery?.data?.address}</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-sm">County, State</p>
                    <p className="text-[#7A7676]">{propertyDetailQuery?.data?.propertySummary?.property_information_and_current_ownership?.county_and_state}</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-sm">Municipality</p>
                    <p className="text-[#7A7676]">{propertyDetailQuery?.data?.propertySummary?.property_information_and_current_ownership?.municipality}</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-sm">PIN/Parcel</p>
                    <p className="text-[#7A7676]">{propertyDetailQuery?.data?.propertySummary?.PIN}</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-sm">Span of Search</p>
                    <p className="text-[#7A7676]">Pending</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase text-sm">Date of Search</p>
                    <p className="text-[#7A7676]">{propertyDetailQuery?.data?.propertySummary?.["Date of Search"]}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="border border-[#F1EDEA] rounded-lg p-4 bg-[#FEFAF5]">
                      <p className="font-semibold uppercase">Current Owner</p>
                      <p className="text-[#7A7676]">{propertyDetailQuery?.data?.propertySummary?.property_information_and_current_ownership?.current_owner}</p>
                    </div>
                    <div className="border border-[#F1EDEA] rounded-lg p-4 bg-[#FEFAF5]">
                      <p className="font-semibold uppercase">Tax Assessment</p>
                      <p className="text-[#7A7676]">{propertyDetailQuery?.data?.propertySummary?.["Tax Assessment"]}</p>
                    </div>
                  </div>

                  <div className="border border-[#F1EDEA] rounded-lg p-4 text-[13px] bg-[#FEFAF5]">
                    <p className="font-semibold uppercase">Title Deed</p>
                    <p className="text-[#7A7676]">
                      {propertyDetailQuery?.data?.propertySummary?.property_information_and_current_ownership?.title_deed}
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <p className="font-semibold text-lg text-[#4C0D0D] mb-3">
                    Document Processing Status
                  </p>

                  <div className="overflow-hidden border border-[#F1EDEA] rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-[#F9F6F4] text-[#4C0D0D]  text-left">
                        <tr className="*:!font-medium" >
                          <th className="py-3 px-4">Sr. No.</th>
                          <th className="py-3 px-4">Document Type</th>
                          <th className="py-3 px-4">Date Recorded</th>
                          {/* <th className="py-3 px-4">Document ID</th> */}
                          {/* <th className="py-3 px-4">Progress</th> */}
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pdfDocuments?.map((item, i) => (
                          <tr
                            key={i}
                            className="border-t border-[#F1EDEA] text-[#4C0D0D]"
                          >
                            <td className="py-3 px-4">{i + 1}</td>
                            <td className="py-3 px-4 uppercase">Document {i + 1}</td>
                            <td className="py-3 px-4">{format(item?.lastEdited, "dd MMM yyyy")}</td>
                            {/* <td className="py-3 px-4">{item.id}</td> */}
                            {/* <td className="py-3 px-4">
                              <div className="w-[100px] bg-[#EAF7ED] rounded-full h-[6px] overflow-hidden">
                                <div className="bg-[#3A9447] h-[6px] w-[90%] rounded-full"></div>
                              </div>
                            </td> */}
                            <td className="py-3 px-4">
                              <a href={item?.url} target="_blank" rel="noreferrer">
                                <Eye className="w-4 h-4 text-[#4C0D0D] mx-auto" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl overflow-hidden border border-[#F1EDEA]">
                  <img
                    src="/property.png"
                    alt="Property"
                    width={300}
                    height={270}
                    className="object-cover w-full h-[270px]"
                  />
                </div>
                <div className="rounded-xl overflow-hidden border border-[#F1EDEA]">
                  <img
                    src="/map-geo.png"
                    alt="Map"
                    width={300}
                    height={270}
                    className="object-cover w-full h-[270px]"
                  />
                </div>
              </div>
            </div>

            <Separator />
            <div className="flex justify-between items-center mt-4 text-[13px]">
              <p className="text-[#4C0D0D]">
                Total Documents Completed:{" "}
                <span className="font-semibold">{pdfDocuments?.length ?? 0}</span>
                <br />
                Status:{" "}
                <Badge  className={`${
                  propertyDetailQuery?.data?.status === "SUCCESS"
                    ? "bg-[#E9F3E9] text-[#1E8221]"
                    : propertyDetailQuery?.data?.status === "Unconfirmed"
                    ? "bg-[#FFF3D9] text-[#A2781E]"
                    : "bg-[#FFE3E2] text-[#FF5F59]"} text-[13px] font-medium px-3 py-1 rounded-md`}>
                {propertyDetailQuery?.data.status}
              </Badge>
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border border-[#4C0D0D] text-[#4C0D0D] hover:bg-[#4C0D0D]/5 px-5 rounded-lg"
                >
                  Download CSV
                </Button>
                <Button className="bg-[#4C0D0D] text-white hover:bg-[#4C0D0D]/90 px-5 rounded-lg" disabled={!propertyDetailQuery?.data?.zip_url}>
                  <a href={propertyDetailQuery?.data?.zip_url} target="_blank" rel="noreferrer">Download All as ZIP</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
