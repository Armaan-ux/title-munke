import { ChevronLeft, Loader2 } from "lucide-react";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BackBtn from "../back-btn";
import { useQuery } from "@tanstack/react-query";
import { handleCreateAuditLog, queryKeys } from "@/utils";
import { getSearchedStatus } from "../service/userAdmin";
import { format } from "date-fns-tz";
import { CenterLoader } from "./Loader";
import ShowError from "./ShowError";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { useUserIdType } from "@/hooks/useUserIdType";
import GoogleMapView from "./google-map";
import StreetView from "./street-view";
import { AgGridReact } from "ag-grid-react";

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => <span>{props.node.rowIndex + 1}</span>;

const DocTypeRenderer = (props) => (
  <span className="uppercase">Document {props.node.rowIndex + 1}</span>
);

const DateRecordedRenderer = (props) => {
  const value = props?.data?.date_of_record;

  return (
    <span>
      {value === null || value === "null" || value === undefined ? "-" : value}
    </span>
  );
};

const ActionRenderer = (props) => (
  <div className="flex items-center justify-center h-full">
    <a href={props.data?.url} target="_blank" rel="noreferrer">
      <Eye className="w-4 h-4 text-[#4C0D0D]" />
    </a>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const PropertyDetails = () => {
  const { userType } = useUserIdType();
  const navigate = useNavigate();
  const { id } = useParams();
  const { downloadCSV } = useDownloadCsv();

  const propertyDetailQuery = useQuery({
    queryKey: [queryKeys?.propertyDetail, id],
    queryFn: () => getSearchedStatus(id),
    refetchInterval: (query) =>
      query?.state?.data?.status === "IN_PROGRESS" ? 5000 : false,
    enabled: !!id,
  });
  console.log("propertyDetailQuery>>>>>>>", propertyDetailQuery?.data);
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
      },
      {
        headerName: "Document Type",
        field: "type",
        cellRenderer: DocTypeRenderer,
        flex: 1,
        minWidth: 160,
        sortable: false,
      },
      {
        headerName: "Date Recorded",
        field: "lastEdited",
        cellRenderer: DateRecordedRenderer,
        flex: 1,
        minWidth: 160,
      },
      {
        headerName: "Actions",
        field: "url",
        cellRenderer: ActionRenderer,
        flex: 1,
        minWidth: 100,
        sortable: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
    ],
    [],
  );

  if (propertyDetailQuery?.isLoading) return <CenterLoader />;
  if (propertyDetailQuery?.isError)
    return (
      <ShowError
        message={propertyDetailQuery?.error?.response?.data?.message}
      />
    );

  const pdfDocuments =
    propertyDetailQuery?.data?.documents?.filter(
      (item) => item?.type === "pdf",
    ) ?? [];

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
      </div>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-2xl mb-1 font-semibold text-[#4C0D0D]">
                  {propertyDetailQuery?.data?.address},{" "}
                  {
                    propertyDetailQuery?.data?.propertySummary
                      ?.property_information_and_current_ownership
                      ?.county_and_state
                  }
                </p>
                <p className="text-sm text-[#8B8686] mt-1">
                  Searched on:
                  <span className="font-semibold text-[#4C0D0D]">
                    {
                      propertyDetailQuery?.data?.propertySummary?.[
                        "Date of Search"
                      ]
                    }
                  </span>
                  | Search ID:
                  <span className="font-semibold text-[#4C0D0D]">
                    {propertyDetailQuery?.data?.searchId}
                  </span>
                </p>
              </div>
              <Badge
                className={`${
                  propertyDetailQuery?.data?.status === "SUCCESS"
                    ? "bg-[#E9F3E9] text-[#1E8221]"
                    : propertyDetailQuery?.data?.status === "Unconfirmed"
                      ? "bg-[#FFF3D9] text-[#A2781E]"
                      : propertyDetailQuery?.data?.status === "IN_PROGRESS"
                        ? "bg-[#fff6e2] text-[#ffa200]"
                        : "bg-[#FFE3E2] text-[#FF5F59]"
                } text-[13px] font-medium px-3 py-1 rounded-md`}
              >
                {propertyDetailQuery?.data.status}
              </Badge>
            </div>

            <Separator />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
              <div>
                <p className="font-semibold text-lg text-[#4C0D0D] mb-2">
                  Description
                </p>

                <div className="relative">
                  {propertyDetailQuery?.data?.status === "IN_PROGRESS" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 backdrop-blur-[3px]">
                      <p className="text-xl font-semibold text-[#4C0D0D]">
                        Processing...{" "}
                        {propertyDetailQuery?.data?.percent_completion || 0}%
                      </p>
                      {propertyDetailQuery?.data?.status_message && (
                        <p className="text-sm text-[#4C0D0D] mt-2">
                          {propertyDetailQuery?.data?.status_message}
                        </p>
                      )}
                    </div>
                  )}
                  <div
                    className={`grid grid-cols-3 gap-8 text-sm text-[#4C0D0D] ${propertyDetailQuery?.data?.status !== "SUCCESS" ? "opacity-5 pointer-events-none" : ""}`}
                  >
                    <div>
                      <p className="font-semibold uppercase text-sm">
                        Location
                      </p>
                      <p className="text-[#7A7676]">
                        {
                          propertyDetailQuery?.data?.propertySummary
                            ?.property_information_and_current_ownership
                            ?.property_information
                        }
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
                      <p className="font-semibold uppercase text-sm">
                        Property
                      </p>
                      <p className="text-[#7A7676]">
                        {propertyDetailQuery?.data?.address}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase text-sm">
                        County, State
                      </p>
                      <p className="text-[#7A7676]">
                        {
                          propertyDetailQuery?.data?.propertySummary
                            ?.property_information_and_current_ownership
                            ?.county_and_state
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase text-sm">
                        Municipality
                      </p>
                      <p className="text-[#7A7676]">
                        {
                          propertyDetailQuery?.data?.propertySummary
                            ?.property_information_and_current_ownership
                            ?.municipality
                        }
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase text-sm">
                        PIN/Parcel
                      </p>
                      <p className="text-[#7A7676]">
                        {propertyDetailQuery?.data?.propertySummary?.PIN}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase text-sm">
                        Span of Search
                      </p>
                      <p className="text-[#7A7676]">
                        {propertyDetailQuery?.data?.span_of_search || ""}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase text-sm">
                        Date of Search
                      </p>
                      <p className="text-[#7A7676]">
                        {
                          propertyDetailQuery?.data?.propertySummary?.[
                            "Date of Search"
                          ]
                        }
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-4 space-y-2 ${propertyDetailQuery?.data?.status !== "SUCCESS" ? "opacity-5 pointer-events-none" : ""}`}
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="border border-[#F1EDEA] rounded-lg p-4 bg-[#FEFAF5]">
                        <p className="font-semibold uppercase">Current Owner</p>
                        <p className="text-[#7A7676]">
                          {
                            propertyDetailQuery?.data?.propertySummary
                              ?.property_information_and_current_ownership
                              ?.current_owner
                          }
                        </p>
                      </div>
                      <div className="border border-[#F1EDEA] rounded-lg p-4 bg-[#FEFAF5]">
                        <p className="font-semibold uppercase">
                          Tax Assessment
                        </p>
                        <p className="text-[#7A7676]">
                          {
                            propertyDetailQuery?.data?.propertySummary?.[
                              "Tax Assessment"
                            ]
                          }
                        </p>
                      </div>
                    </div>
                    <div className="border border-[#F1EDEA] rounded-lg p-4 text-[13px] bg-[#FEFAF5]">
                      <p className="font-semibold uppercase">Title Deed</p>
                      <p className="text-[#7A7676]">
                        {
                          propertyDetailQuery?.data?.propertySummary
                            ?.property_information_and_current_ownership
                            ?.title_deed
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Document Processing Status ── */}
                <div className="mt-8">
                  <p className="font-semibold text-lg text-[#4C0D0D] mb-3">
                    Document Processing Status
                  </p>

                  <div className="ag-theme-quartz custom-ag-grid overflow-hidden border border-[#F1EDEA] rounded-xl">
                    {propertyDetailQuery?.data?.status === "IN_PROGRESS" &&
                    pdfDocuments.length === 0 ? (
                      <div className="flex items-center justify-center py-6 text-[#4C0D0D] gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <AgGridReact
                          rowData={pdfDocuments}
                          columnDefs={columnDefs}
                          defaultColDef={{
                            flex: 1,
                            minWidth: 100,
                            filter: false,
                            sortable: true,
                            resizable: true,
                            unSortIcon: true,
                            wrapHeaderText: true,
                            autoHeaderHeight: true,
                          }}
                          rowHeight={56}
                          headerHeight={48}
                          domLayout="autoHeight"
                          animateRows={true}
                          overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
                        />
                        {propertyDetailQuery?.data?.status ===
                          "IN_PROGRESS" && (
                          <div className="flex items-center justify-center py-3 border-t border-[#F1EDEA] text-[#4C0D0D] gap-2 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {(() => {
                  const latVal = propertyDetailQuery?.data?.latitude;
                  const lngVal = propertyDetailQuery?.data?.longitude;
                  const lat = latVal ? parseFloat(latVal) : null;
                  const lng = lngVal ? parseFloat(lngVal) : null;
                  const isValidCoords =
                    lat !== null &&
                    lng !== null &&
                    isFinite(lat) &&
                    isFinite(lng) &&
                    lat >= -90 &&
                    lat <= 90 &&
                    lng >= -180 &&
                    lng <= 180;
                  return (
                    <div
                      className={`rounded-xl overflow-hidden ${isValidCoords ? "border border-[#F1EDEA]" : ""}`}
                    >
                      {isValidCoords ? (
                        <StreetView lat={lat} lng={lng} />
                      ) : (
                        <div className="h-[300px] flex items-center justify-center bg-[#F9F6F4] rounded-xl">
                          <p className="text-[#7A7676]">
                            Street view unavailable
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
                {(() => {
                  const latVal = propertyDetailQuery?.data?.latitude;
                  const lngVal = propertyDetailQuery?.data?.longitude;
                  const lat = latVal ? parseFloat(latVal) : null;
                  const lng = lngVal ? parseFloat(lngVal) : null;
                  const isValidCoords =
                    lat !== null &&
                    lng !== null &&
                    isFinite(lat) &&
                    isFinite(lng) &&
                    lat >= -90 &&
                    lat <= 90 &&
                    lng >= -180 &&
                    lng <= 180;
                  return (
                    <div
                      className={`rounded-xl overflow-hidden ${isValidCoords ? "border border-[#F1EDEA]" : ""}`}
                    >
                      {isValidCoords ? (
                        <GoogleMapView lat={lat} lng={lng} />
                      ) : (
                        <div className="h-[300px] flex items-center justify-center bg-[#F9F6F4] rounded-xl">
                          <p className="text-[#7A7676]">
                            Map location unavailable
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <Separator />
            <div className="flex justify-between items-center mt-4 text-[13px]">
              <p className="text-[#4C0D0D]">
                Total Documents Completed:{" "}
                <span className="font-semibold">
                  {pdfDocuments?.length ?? 0}
                </span>
                <br />
                Status:{" "}
                <Badge
                  className={`${
                    propertyDetailQuery?.data?.status === "SUCCESS"
                      ? "bg-[#E9F3E9] text-[#1E8221]"
                      : propertyDetailQuery?.data?.status === "Unconfirmed"
                        ? "bg-[#FFF3D9] text-[#A2781E]"
                        : propertyDetailQuery?.data?.status === "IN_PROGRESS"
                          ? "bg-[#fff6e2] text-[#ffa200]"
                          : "bg-[#FFE3E2] text-[#FF5F59]"
                  } text-[13px] font-medium px-3 py-1 rounded-md`}
                >
                  {propertyDetailQuery?.data.status === "IN_PROGRESS"
                    ? "In Progress"
                    : propertyDetailQuery?.data.status}
                </Badge>
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border border-[#4C0D0D] text-[#4C0D0D] hover:bg-[#4C0D0D]/5 px-5 rounded-lg"
                  disabled={propertyDetailQuery?.data?.status !== "SUCCESS"}
                  onClick={() =>
                    downloadCSV(
                      pdfDocuments?.map?.((item, index) => ({
                        "Sr. No.": index + 1,
                        "Document Type": `Document ${index + 1}`,
                        "Date Recorded": format(
                          item?.lastEdited,
                          "dd MMM yyyy",
                        ),
                        "Download Link": item?.url,
                      })),
                    )
                  }
                >
                  Download CSV
                </Button>
                <Button
                  className="bg-[#4C0D0D] text-white hover:bg-[#4C0D0D]/90 px-5 rounded-lg"
                  disabled={!propertyDetailQuery?.data?.downloadLink}
                  onClick={() =>
                    handleCreateAuditLog(
                      "DOWNLOAD",
                      { zipUrl: propertyDetailQuery?.data?.downloadLink },
                      userType === "agent",
                    )
                  }
                >
                  <a
                    href={propertyDetailQuery?.data?.zip_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download All as ZIP
                  </a>
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
