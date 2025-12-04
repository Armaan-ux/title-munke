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
import { queryKeys } from "@/utils";
import { getIndividualListing } from "../service/userAdmin";
import ShowError from "../common/ShowError";
import { CenterLoader } from "../common/Loader";


export default function IndividualBusinessTable() {
  const individualListingQuery = useQuery({
    queryKey: [queryKeys.individualListingForAdmin],
    queryFn: () => getIndividualListing(true),
  });

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
                Property Search
                {/* <p className="flex items-center gap-2">
                        Property Search <span>{getSortArrow("createdAt")}</span>
                      </p> */}
              </TableHead>

              <TableHead className="text-center">Business</TableHead>
              <TableHead className="text-center"> Action</TableHead>
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
                    ${item?.revenue}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={`/admin/property-search-individual/${item?.id}`}>
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
