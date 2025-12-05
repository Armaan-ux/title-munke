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

function AuditLogsAgent() {
  const {userId} = useUserIdType();
  const auditLogAgentQuery = useQuery({
    queryKey: [queryKeys.auditLogAgent, userId],
    queryFn: () => getAuditLogsForBroker(userId, true)
  })

  return (
    <div className="bg-[#F5F0EC] rounded-lg text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {auditLogAgentQuery?.isLoading && <CenterLoader />}
        {auditLogAgentQuery?.isError && <ShowError message={auditLogAgentQuery?.error?.response?.data?.message} />}
        {auditLogAgentQuery?.isSuccess &&
          <Table className="">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead>Sr. No.</TableHead>
                {/* <TableHead>Action</TableHead> */}
                <TableHead>Details</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogAgentQuery?.data?.items?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="font-medium text-center py-10"
                  >
                    No Records found.
                  </TableCell>
                </TableRow>
              ) : (
                auditLogAgentQuery?.data?.items?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    {/* <TableCell className="font-medium">{item.action}</TableCell> */}
                    <TableCell>{item?.detail?.replace(/[{}"]/g, "")}</TableCell>
                    <TableCell>{item.email}</TableCell>
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

export default AuditLogsAgent;
