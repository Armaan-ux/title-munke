import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function EmailTemplate() {
  const data = {
    total: 5,
    success: 3,
    fail: 2,
    dateRange: "Oct 06, 2025 – Oct 10, 2025",
    generatedOn: "10/15/2025, 7:03:22 PM",
    activity: [
      { id: 1, address: "221B Baker Street, London", status: "Successful" },
      { id: 2, address: "742 Evergreen Terrace, Springfield", status: "Successful" },
      { id: 3, address: "1600 Amphitheatre Pkwy, Mountain View", status: "Unsuccessful" },
      { id: 4, address: "1 Infinite Loop, Cupertino", status: "Unsuccessful" },
      { id: 5, address: "10 Downing Street, London", status: "Successful" },
    ],
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm max-w-3xl mx-auto border border-neutral-200 mt-10">
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-start">
          <img src="/Logo.svg" alt="Logo" className="w-20 mb-1" />
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-secondary mb-1 !font-poppins">Weekly Usage Summary</h2>
          <p className="text-sm text-coffee-light">{data.dateRange}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card className="bg-[#f9f3ef] rounded-2xl border-none">
          <CardContent className="py-2 text-center">
            <p className="text-sm text-coffee-light mb-1 text-left">Total Searches</p>
            <p className="text-3xl font-semibold text-secondary text-left">{data.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#f9f3ef] rounded-2xl border-none">
          <CardContent className="py-2 text-center">
            <p className="text-sm text-coffee-light mb-1 text-left">Successful Searches</p>
            <p className="text-3xl font-semibold text-secondary text-left">{data.success}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#f9f3ef] rounded-2xl border-none">
          <CardContent className="py-2 text-center">
            <p className="text-sm text-coffee-light mb-1 text-left">Unsuccessful Searches</p>
            <p className="text-3xl font-semibold text-secondary text-left">{data.fail}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-base font-semibold text-secondary mb-3 !font-poppins">Search Activity</h3>
          <Table className="w-full min-w-[600px] text-left border-collapse text-sm">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead className="w-[100px]">Sr. No.</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.activity.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{String(i + 1).padStart(2, "0")}.</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell><Badge
                      className={`${
                        row?.status === "Successful"
                          ? "bg-[#E9F3E9] text-[#1E8221]"
                          : row?.status === "Unsuccessful"
                          ? "bg-[#FFF3D9] text-[#A2781E]"
                          : "bg-[#FFE3E2] text-[#FF5F59]"
                      } text-[13px] font-medium px-3 py-1 rounded-md`}
                    >
                      {row?.status}
                    </Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        <p className="text-xs text-neutral-500 mt-4">
          Generated on {data.generatedOn}
        </p>
      </div>
    </div>
  )
}
