import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertFromTimestamp, getFormattedDateTime, queryKeys } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns-tz";
import { getOrgBrokersList, listBrokers } from "../service/userAdmin";
import { useQuery } from "@tanstack/react-query";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { useEffect } from "react";

export default function BrokerBusinessTable({
  limit,
  isDownload,
  handleDownloadComplete,
  from,
  to,
}) {
  const brokerListingQuery = useQuery({
    queryKey: [queryKeys.brokerListingForAdminDefault, limit, from, to],
    queryFn: () =>
      getOrgBrokersList({ withSearchCount: true, limit, from, to }),
  });
  const { downloadCSV } = useDownloadCsv();
  useEffect(() => {
    if (
      isDownload &&
      brokerListingQuery?.data?.items?.length > 0 &&
      handleDownloadComplete
    ) {
      const data = brokerListingQuery?.data?.items?.map((item, idx) => ({
        "Sr. No.": idx + 1,
        "Broker Name": item?.name,
        Agent: item?.agentCount,
        "Search Count": item?.totalSearches,
        "Last Activity": getFormattedDateTime(item?.lastLogin),
        Business: `$${item?.revenue}`,
        "Account Created": getFormattedDateTime(item?.createdAt),
      }));
      downloadCSV(data);
      setTimeout(() => handleDownloadComplete?.(), 500);
    } else handleDownloadComplete?.();
  }, [
    isDownload,
    brokerListingQuery?.data?.items,
    downloadCSV,
    handleDownloadComplete,
  ]);
  return (
    <div>
      {brokerListingQuery?.isLoading && <CenterLoader />}
      {brokerListingQuery?.isError && (
        <ShowError
          message={brokerListingQuery?.error?.response?.data?.message}
        />
      )}
      {brokerListingQuery?.isSuccess && (
        <Table className="w-full">
          <TableHeader className="bg-[#F5F0EC] w-full">
            <TableRow className="w-full">
              <TableHead>Sr. No.</TableHead>
              <TableHead>Broker Name</TableHead>
              <TableHead className="text-center">Agents</TableHead>
              <TableHead className="text-center">Search Count</TableHead>
              <TableHead>Last Activity</TableHead>
              {/* <TableHead className="text-center" >Business</TableHead> */}
              <TableHead className="text-center">Account Created</TableHead>
              <TableHead>Action</TableHead>
              {/* <TableHead></TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {brokerListingQuery?.data?.items?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="font-medium text-center py-10"
                >
                  No Records found.
                </TableCell>
              </TableRow>
            ) : (
              brokerListingQuery?.data?.items?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">
                    {item?.agentCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.totalSearches}
                  </TableCell>
                  <TableCell>
                    {getFormattedDateTime(item?.lastLogin)}
                    {/* {convertFromTimestamp(item?.lastLogin)} */}
                  </TableCell>
                  {/* <TableCell className="text-center" >${item?.revenue}</TableCell> */}
                  <TableCell className="text-center">
                    {getFormattedDateTime(item?.createdAt)}
                  </TableCell>
                  <TableCell>
                    {" "}
                    <div className="flex items-center gap-2 flex-row">
                      <Link
                        to={`/organisation/search/broker-property-search/${item?.id}`}
                      >
                        <Button size="icon" className="text-md" variant="ghost">
                          <Eye />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                  {/* <TableCell className="text-right"></TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
