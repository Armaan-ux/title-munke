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
import { listBrokers, listOrganisations } from "../service/userAdmin";
import { useQuery } from "@tanstack/react-query";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";
import { useEffect } from "react";

export default function OrganisationBusinessTable({limit, isDownload, handleDownloadComplete, from, to}) {
  const orgListingQuery = useQuery({
    queryKey: [queryKeys.orgListingForAdminDefault, limit, from, to],
    queryFn: () => listOrganisations({withSearchCount: true, limit, from, to}),
  })
  const {downloadCSV} = useDownloadCsv();
  useEffect(() => {
    if (isDownload && orgListingQuery?.data?.updatedOrganisations?.length > 0 && handleDownloadComplete) {
      const data = orgListingQuery?.data?.updatedOrganisations?.map((item, idx) => (
        {"Sr. No.": idx + 1, "Organization Name": item?.name, "Agent": item?.agentCount, "Search Count": item?.totalSearches, "Last Activity": 
          getFormattedDateTime(item?.lastLogin), Business: `$${item?.revenue}`, "Account Created": getFormattedDateTime(item?.createdAt)}
      ))
      downloadCSV(data);
      setTimeout(() => handleDownloadComplete?.(), 500)
    }
    else handleDownloadComplete?.();

  }, [isDownload, orgListingQuery?.data?.items, downloadCSV, handleDownloadComplete]);
    return(
        <div>
            {orgListingQuery?.isLoading && <CenterLoader />}
            {orgListingQuery?.isError && <ShowError message={orgListingQuery?.error?.response?.data?.message} />}
            {orgListingQuery?.isSuccess &&
              <Table className="w-full">
                <TableHeader className="bg-[#F5F0EC] w-full">
                  <TableRow className="w-full">
                    <TableHead >Sr. No.</TableHead>
                    <TableHead>
                      Organisation Name
                      {/* <p className="flex items-center gap-2">
                        Broker Name<span>{getSortArrow("address")}</span>
                      </p> */}
                    </TableHead>
                    <TableHead className="text-center">
                      Team Strength
                      {/* <p className="flex items-center justify-center gap-2">
                        Agent <span>{getSortArrow("createdAt")}</span>
                      </p> */}
                    </TableHead>
                    <TableHead className="text-center">
                     Total Search 
                      {/* <p className="flex items-center justify-center gap-2">
                        Search Count <span>{getSortArrow("status")}</span>
                      </p> */}
                    </TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-center" >Business</TableHead>
                    <TableHead className="text-center" >Account Created</TableHead>
                    <TableHead>Action</TableHead>
                    {/* <TableHead></TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgListingQuery?.data?.updatedOrganisations?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="font-medium text-center py-10"
                      >
                        No Records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orgListingQuery?.data?.updatedOrganisations?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center" >{item?.teamStrength}</TableCell>
                        <TableCell className="text-center" >{item?.totalSearches}</TableCell>
                        <TableCell>
                          {getFormattedDateTime(item?.lastLogin)}
                          {/* {convertFromTimestamp(item?.lastLogin)} */}
                        </TableCell>
                        <TableCell className="text-center" >${item?.revenue}</TableCell>
                        <TableCell className="text-center" >
                          {getFormattedDateTime(item?.createdAt)}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <div className="flex items-center gap-2 flex-row">
                            <Link to={`/admin/dashboard/org-details/${item?.id}`} >
                            <Button
                              size="icon"
                              className="text-md"
                              variant="ghost"
                              >
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
            }
        </div>
    )
}