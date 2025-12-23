import { getFormattedDateTime, queryKeys } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuditLogsForBroker } from "../service/userAdmin";
import { useQuery } from "@tanstack/react-query";
import { useUserIdType } from "@/hooks/useUserIdType";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";

function AuditLogs() {
  const {userId} = useUserIdType();
  const auditLogBrokerQuery = useQuery({
    queryKey: [queryKeys.auditLogBroker, userId],
    queryFn: () => getAuditLogsForBroker(userId, false)
  })

  return (
    <div className="bg-[#F5F0EC] rounded-lg text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {auditLogBrokerQuery?.isLoading && <CenterLoader />}
        {auditLogBrokerQuery?.isError && <ShowError message={auditLogBrokerQuery?.error?.response?.data?.message} />}
        {auditLogBrokerQuery?.isSuccess &&
          <Table className="">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead>Sr. No.</TableHead>
                {/* <TableHead>Action</TableHead> */}
                <TableHead>Details</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogBrokerQuery?.data?.items?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="font-medium text-center py-10"
                  >
                    No Records found.
                  </TableCell>
                </TableRow>
              ) : (
                auditLogBrokerQuery?.data?.items?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    {/* <TableCell className="font-medium">{item.action}</TableCell> */}
                    <TableCell>{item?.detail?.replace(/[{}"]/g, "")}</TableCell>
                    <TableCell>{getFormattedDateTime(item?.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        }
      </div>
    </div>
  );
}

export default AuditLogs;
