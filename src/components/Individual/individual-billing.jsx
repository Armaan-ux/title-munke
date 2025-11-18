import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardContent } from "@/components/ui/card";
import { useUser } from "@/context/usercontext";
import PaymentMethodModal from "@/components/Modal/PaymentMethodModal";
import SubscriptionSuccessModal from "@/components/Modal/SubscriptionSuccessModal";
import SubscriptionFailedModal from "@/components/Modal/SubscriptionFailedModal";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CircleCheck, FileDown } from "lucide-react";
import { convertFromTimestamp, getFormattedDateTime } from "@/utils";
import { InvoiceModalDummy } from "@/components/Modal/InvoiceModalDummy";
import { useQuery } from "@tanstack/react-query";
import { getInvoice, getSubscriptionDetails } from "../service/userAdmin";
import { useUserIdType } from "@/hooks/useUserIdType";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";

const IndividualBilling = () => {
  const navigate = useNavigate();
  const {userId, userType} = useUserIdType();
  const {
    setPaymentModal,
    paymentModal,
    setPaymentSuccessModal,
    paymentSuccessModal,
    setPaymentFailedModal,
    paymentFailedModal,
  } = useUser();
  const subcriptionDetailQuery = useQuery({
    queryKey: ["subcription-details"],
    queryFn: () => getSubscriptionDetails(userId, userType)
  })
  const invoiceListingQuery = useQuery({
      queryKey: ["listingInvoice"],
      queryFn: () => getInvoice(userId, userType),
      refetchOnWindowFocus: false
    })
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
  const [invoiceModal, setInvoiceModal] = useState(false);
  const cardDetail = subcriptionDetailQuery?.data?.payment_methods?.[0] || {};
  return (
    <>
      {/* {paymentModal && (
        <PaymentMethodModal
          open={paymentModal}
          onOpenChange={() => setPaymentModal(false)}
          onSuccess={() => setPaymentSuccessModal(true)}
        />
      )}
      {paymentSuccessModal && (
        <SubscriptionSuccessModal
          open={paymentSuccessModal}
          onOpenChange={() => setPaymentSuccessModal(false)}
          onFailed={() => setPaymentFailedModal(true)}
        />
      )}

      {paymentFailedModal && (
        <SubscriptionFailedModal
          open={paymentFailedModal}
          onOpenChange={() => setPaymentFailedModal(false)}
        />
      )} */}
      <InvoiceModalDummy
        open={invoiceModal}
        onClose={() => setInvoiceModal(false)}
      />

      <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full h-content shadow-md">
        {subcriptionDetailQuery?.isLoading && <CenterLoader />}
        {subcriptionDetailQuery?.isError && <ShowError />}
        {subcriptionDetailQuery?.isSuccess &&
          <CardContent className="w-full space-y-6">
            <div>
              <h2 className="text-xl !font-poppins font-semibold text-secondary">
                Billing Details
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-md uppercase text-coffee-text-billing font-medium">
                    PAYMENT METHOD
                  </p>
                  <div className="flex items-center space-x-3">
                    <img
                      src="/mastercard-icon.svg"
                      alt="Visa"
                      className="w-8 h-8"
                    />
                    <div className="flex gap-4">
                      <p className="font-medium ttext-secondary">
                        <span className="tracking-widest">**** {cardDetail?.last4}</span>
                      </p>
                      <p className="text-sm text-coffee-text-billing font-medium">
                        Expire {`${cardDetail?.exp_month}`?.padStart(2, "0")}/{cardDetail?.exp_year}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-sm text-tertiary hover:underline"
                    onClick={() => setPaymentModal(true)}
                  >
                    + Add Payment Method
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-md uppercase text-coffee-text-billing font-medium">
                    Billing Contact
                  </p>
                  <p className="text-sm text-secondary font-medium mt-1 mr-92">
                    {subcriptionDetailQuery?.data?.customerName} 
                  </p>
                  <p className="text-sm text-gray-900 font-medium mt-1"></p>
                </div>
              </div>
            </div>
          </CardContent>
        }
      </div>

      <div
        className={`bg-white rounded-xl p-2 flex flex-col md:flex-row  gap-10 w-full h-content shadow-md mt-4 ${
          invoiceListingQuery?.data?.invoices?.length === 0 ? "items-center justify-center" : ""
        }`}
      >
        {invoiceListingQuery?.isError &&
            <ShowError message={invoiceListingQuery?.error?.response?.data?.message}/>
          }
          {invoiceListingQuery?.isLoading && <CenterLoader />}
          {invoiceListingQuery.isSuccess && invoiceListingQuery?.data?.invoices?.length > 0  &&
          <div className="bg-white !p-4 rounded-xl w-full">
            <div className="flex justify-between items-center gap-4 mb-6">
              <p className="text-secondary font-medium text-xl">View History</p>
              <Link to="/individual/billing-history" >
                <Button
                  variant="outline"
                  >
                  View More
                </Button>
              </Link>
            </div>

            <Table className="">
              <TableHeader className="bg-[#F5F0EC]">
                <TableRow>
                  <TableHead >Sr. No.</TableHead>
                  <TableHead>
                    <p className="flex items-center gap-2">Invoice ID</p>
                  </TableHead>
                  <TableHead>
                    <p className="flex items-center gap-2">Date</p>
                  </TableHead>
                  <TableHead>
                    <p className="flex items-center gap-2">Amount</p>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center" >Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceListingQuery?.data?.invoices?.slice(0, 5)?.map((invoice, index) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="text-black font-medium" >{invoice?.id}</TableCell>
                    <TableCell>{convertFromTimestamp(invoice?.created, "dateTime")}</TableCell>
                    <TableCell>${invoice?.total / 100}</TableCell>
                    <TableCell
                      className={`${
                        invoice?.status === "paid"
                            ? "text-[#1E8221]"
                            : invoice?.status === "open"
                            ? "text-[#A2781E]"
                            : "text-[#FF5F59]"
                      } text-[13px] font-medium px-3 py-1 rounded-md`}
                    >
                      <div className="flex flow-row gap-2 items-center">
                        <CircleCheck /> {invoice?.status}
                      </div>
                    </TableCell>

                    <TableCell className="text-center" >
                        <Button variant="ghost" size="icon" 
                          onClick={() => setInvoiceModal(true)}
                        >
                          <FileDown
                            className="size-5 mx-auto"
                            />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
}
         {invoiceListingQuery.isSuccess && invoiceListingQuery?.data?.invoices?.length === 0  &&
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
              Once you start exploring, your search invoice history records will
              appear here.
            </p>
          </div>
}

      </div>
    </>
  );
};

export default IndividualBilling;
