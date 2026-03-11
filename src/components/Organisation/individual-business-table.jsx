import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFormattedDateTime, queryKeys } from "@/utils";
import { getIndividualListing, getOrgAgentsList } from "../service/userAdmin";
import ShowError from "../common/ShowError";
import { CenterLoader } from "../common/Loader";
import { useEffect } from "react";
import { useDownloadCsv } from "@/hooks/useDownloadCsv";


export default function IndividualBusinessTable({limit, isDownload, handleDownloadComplete, from, to}) {
  const individualListingQuery = useQuery({
    queryKey: [queryKeys.individualListingForAdmin, limit, from, to],
    queryFn: () => getOrgAgentsList({withSearchCount: true, limit, from, to}),
  });
  const {downloadCSV} = useDownloadCsv();
  useEffect(() => {
    if (isDownload && individualListingQuery?.data?.items?.length > 0 && handleDownloadComplete) {
      const data = individualListingQuery?.data?.items?.map((item, idx) => (
        {"Sr. No.": idx + 1, "Name": item?.name, "Property Search": item?.totalSearches, Business: `$${item?.revenue}`}
      ))
      downloadCSV(data);
      setTimeout(handleDownloadComplete, 500)
    }
    else handleDownloadComplete?.();

  }, [isDownload, individualListingQuery?.data?.items, downloadCSV, handleDownloadComplete]);
  return (
    <div>
      {individualListingQuery?.isLoading && <CenterLoader />}
      {individualListingQuery?.isError && <ShowError message={individualListingQuery?.error?.response?.data?.message} />}
      {individualListingQuery?.isSuccess &&
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>
                Name
                {/* <p className="flex items-center gap-2">
                        Name<span>{getSortArrow("address")}</span>
                      </p> */}
              </TableHead>
              <TableHead className="text-center">
                Property Searches
                {/* <p className="flex items-center gap-2">
                        Property Search <span>{getSortArrow("createdAt")}</span>
                      </p> */}
              </TableHead>

              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {individualListingQuery?.data?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="font-medium text-center py-10">
                  No Records found.
                </TableCell>
              </TableRow>
            ) : (
              individualListingQuery?.data?.items?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell className="text-center">
                    {item?.totalSearches}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={`/organisation/search/property-search/${item?.id}`}>
                      <Button size="icon" className="text-md" variant="ghost">
                        <Eye />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      }
    </div>
  );
}
