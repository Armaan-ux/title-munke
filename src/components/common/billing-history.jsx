import { ChevronLeft, CircleCheck, Eye, FileDown, Link } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getFormattedDateTime, handleCreateAuditLog } from "@/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { InvoiceModal } from "../Modal/InvoiceModal";
import { Cancel } from "@radix-ui/react-alert-dialog";
import { CancelSubscriptionModal } from "../Modal/CancelSubscriptionModal";
import { HelpUsImproveModal } from "../Modal/HelpUsImproveModal";
import { SubscriptionCanceledSuccessModal } from "../Modal/SubscriptionCanceledSuccessModal";
import { InvoiceHistoryModal } from "../Modal/InvoiceHistoryModal";

const BillingHistory = () => {
  const navigate = useNavigate();
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [cancleSubscriptionModal, setCancleSubscriptionModal] = useState(false);
  const [helpUsImproveModal, setHelpUsImproveModal] = useState(false);
  const [cancleSubscriptionSucessModal, setCancleSubscriptionSucessModal] =
    useState(false);
  const [invoiceHistoryModal, setInvoiceHistoryModal] = useState(false);

  const sortedHistories = [
    {
      id: "1",
      invoiceId: "INV-1001",
      billingPeriod: "January 2023",
      amount: "$49.99",
      createdAt: "2023-03-01T00:00:00.000Z",
      status: "Pending",
      billing: "2023-03-01T00:00:00.000Z",
      downloadLink: "/invoices/INV-1001.pdf",
    },
    {
      id: "1",
      invoiceId: "INV-1002",
      billingPeriod: "January 2025",
      amount: "$149.99",
      createdAt: "2023-03-01T00:00:00.000Z",
      status: "Paid",
      billing: "2023-03-01T00:00:00.000Z",
      downloadLink: "/invoices/INV-1002.pdf",
    },
  ];
  return (
    <>
      <InvoiceModal
        open={invoiceModal}
        onOpenChange={() => setInvoiceModal(false)}
      />
      <CancelSubscriptionModal
        open={cancleSubscriptionModal}
        onClose={() => setCancleSubscriptionModal(false)}
        onHelpUsImprove={() => setHelpUsImproveModal(true)}
      />
      <HelpUsImproveModal
        open={helpUsImproveModal}
        onClose={() => setHelpUsImproveModal(false)}
        onSubmit={() => setCancleSubscriptionSucessModal(true)}
      />
      <SubscriptionCanceledSuccessModal
        open={cancleSubscriptionSucessModal}
        onClose={() => setCancleSubscriptionSucessModal(false)}
      />

      <InvoiceHistoryModal
        open={invoiceHistoryModal}
        onClose={() => setInvoiceHistoryModal(false)}
      />

      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-md  text-secondary">Back</p>
        </div>
      </div>

      <div className="bg-[#F5F0EC] rounded-lg p-7  text-secondary h-[82%]">
        <div
          className={`bg-white rounded-xl p-2 flex flex-col md:flex-row  gap-10 w-full h-full shadow-md ${
            sortedHistories.length === 0 ? "items-center justify-center" : ""
          }`}
        >
          {true ? (
            <div className="bg-white !p-4 rounded-xl w-full">
              <p className="text-xl text-secondary mb-4">View History</p>
              <Table className="">
                <TableHeader className="bg-[#F5F0EC]">
                  <TableRow>
                    <TableHead className="w-[100px]">Sr. No.</TableHead>
                    <TableHead>
                      <p className="flex items-center gap-2">Invoice ID</p>
                    </TableHead>
                    <TableHead>
                      <p className="flex items-center gap-2">Billing Period</p>
                    </TableHead>
                    <TableHead>
                      <p className="flex items-center gap-2">Amount</p>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Download</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedHistories?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.invoiceId}</TableCell>
                      <TableCell>
                        {getFormattedDateTime(item?.billing)}
                      </TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell  onClick={() => setCancleSubscriptionModal(true)}
                        className={`${
                          item?.status === "Paid"
                            ? "text-[#1E8221]"
                            : item?.status === "Pending"
                            ? "text-[#A2781E]"
                            : "text-[#FF5F59]"
                        } text-[13px] font-medium px-3 py-1 rounded-md`}
                      >
                        <div className="flex flow-row gap-2 items-center">
                          <CircleCheck
                           
                          />{" "}
                          {item?.status}
                        </div>
                      </TableCell>

                      <TableCell>
                        {item?.downloadLink ? (
                          <FileDown
                            className="w-4 h-4"
                            onClick={() => setInvoiceModal(true)}
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-row">
                          <Button
                            size="icon"
                            className="text-md"
                            variant="ghost"
                            onClick={() => setInvoiceHistoryModal(true)}
                          >
                            <Eye />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="text-center space-y-2 my-4 text-muted-foreground">
                {loading && <p>Loading...</p>}
                {!hasMore && sortedHistories.length > 0 && (
                  <p>No more data to load.</p>
                )}

                {searchHistories?.length > 0 && hasMore && !loading && (
                  <div className="flex justify-center">
                    <Button
                      // className="loadmore"
                      size="sm"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 w-full gap-4">
              <img
                src="/search-icon.svg"
                alt="invoice icon"
                className="w-20 h-20"
              />

              <h2 className="text-3xl font-semibold text-secondary mb-2">
                No Invoice Yet
              </h2>

              <p className="max-w-md text-md text-secondary">
                It looks like you haven’t initiated any property searches yet.
                Once you start exploring, your search invoice history records
                will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BillingHistory;
