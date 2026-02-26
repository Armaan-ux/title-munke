import { CircleCheck, Eye, FileDown} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertFromTimestamp } from "@/utils";
import { Button } from "@/components/ui/button";
import { InvoiceModal } from "@/components/Modal/InvoiceModal";
import { CancelSubscriptionModal } from "@/components/Modal/CancelSubscriptionModal";
import { HelpUsImproveModal } from "@/components/Modal/HelpUsImproveModal";
import { SubscriptionCanceledSuccessModal } from "@/components/Modal/SubscriptionCanceledSuccessModal";
import { InvoiceHistoryModal } from "@/components/Modal/InvoiceHistoryModal";
import BackBtn from "../back-btn";
import { useQuery } from "@tanstack/react-query";
import { getInvoice, getSubscriptionDetails } from "../service/userAdmin";
import { useUser } from "@/context/usercontext";
import { CenterLoader } from "./Loader";
import ShowError from "./ShowError";
import { InvoiceModalDummy } from "../Modal/InvoiceModalDummy";
import { Dialog, DialogContent } from "../ui/dialog";

const BillingHistory = () => {

  const navigate = useNavigate();
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [cancleSubscriptionModal, setCancleSubscriptionModal] = useState(false);
  const [helpUsImproveModal, setHelpUsImproveModal] = useState(false);
  const [cancleSubscriptionSucessModal, setCancleSubscriptionSucessModal] = useState(false);
  const [invoiceHistoryModal, setInvoiceHistoryModal] = useState(false);
  const [selectInvoice, setSelectedInvoice] = useState({});
  const {user} = useUser()
  const userType = user?.signInUserSession?.idToken?.payload['cognito:groups']?.[0];
  const invoiceListingQuery = useQuery({
    queryKey: ["listingInvoice"],
    queryFn: () => getInvoice(user?.attributes?.sub, userType),
    refetchOnWindowFocus: false
  })

  return (
    <div className="relative">
      {invoiceModal && 
        <div className="absolute left-[120%]">
          <InvoiceModalDummy
            onClose={() => {
              setInvoiceModal(false);
              setSelectedInvoice({})
            }}
            invoice={selectInvoice}
          />
        </div>
      }
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

      {/* {invoiceHistoryModal &&
        <InvoiceModalDummy
          open={invoiceHistoryModal}
          onClose={() => {setInvoiceHistoryModal(false); setSelectedInvoice({})}}
          invoice={selectInvoice}
        />
      } */}
      {
        invoiceHistoryModal &&
        <Dialog open={invoiceHistoryModal} onOpenChange={() => {setInvoiceHistoryModal(false); setSelectedInvoice({})}}>
          <DialogContent  showCloseButton={false} className="!max-w-xl !w-full rounded-2xl bg-white p-6 shadow-lg">
            <InvoiceModalDummy
              open={invoiceHistoryModal}
              invoice={selectInvoice}
              onClose={() => {setInvoiceHistoryModal(false); setSelectedInvoice({})}}
              isPrint={false}
            />
          </DialogContent>
        </Dialog>
      }

      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
        {/* <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-lg text-secondary">Back</p>
        </div> */}
      </div>

      <div className="bg-[#F5F0EC] rounded-lg p-7  text-secondary h-[82%]">
        <div
          className={`bg-white rounded-xl p-2 flex flex-col md:flex-row  gap-10 w-full h-full shadow-md ${
            invoiceListingQuery?.data?.invoices?.length === 0 ? "items-center justify-center" : ""
          }`}
        >
          {invoiceListingQuery?.isError &&
            <ShowError message={invoiceListingQuery?.error?.response?.data?.message}/>
          }
          {invoiceListingQuery?.isLoading && <CenterLoader />}
          {invoiceListingQuery.isSuccess && invoiceListingQuery?.data?.invoices?.length > 0  &&
            <div className="bg-white !p-4 rounded-xl w-full">
              <p className="text-lg text-secondary font-medium mb-4">Invoice History</p>
              <Table className="">
                <TableHeader className="bg-[#F5F0EC]">
                  <TableRow>
                    <TableHead className="w-[100px]">Sr. No.</TableHead>
                    <TableHead>
                      <p className="flex items-center gap-2">Invoice ID</p>
                    </TableHead>
                    <TableHead>
                      <p className="flex items-center gap-2">Date </p>
                    </TableHead>
                    <TableHead>
                      <p className="flex items-center gap-2">Amount</p>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center" >Download</TableHead>
                    <TableHead className="text-center" >Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceListingQuery?.data?.invoices?.map((invoice, index) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-black">{index + 1}</TableCell>
                      <TableCell className="text-black font-medium" >{invoice?.id}</TableCell>
                      <TableCell >
                        {convertFromTimestamp(invoice?.created, "dateTime")}
                      </TableCell>
                      <TableCell>${invoice?.total / 100}</TableCell>
                      <TableCell  onClick={() => setCancleSubscriptionModal(true)}
                        className={`${
                          invoice?.status === "paid"
                            ? "text-[#1E8221]"
                            : invoice?.status === "open"
                            ? "text-[#A2781E]"
                            : "text-[#FF5F59]"
                        } text-[13px] font-medium px-3 py-1 rounded-md`}
                      >
                        <div className="flex flow-row gap-2 items-center">
                          <CircleCheck
                           
                          />{" "}
                          {invoice?.status}
                        </div>
                      </TableCell>

                      <TableCell className="text-center" >
                        <Button variant="ghost" size="icon" 
                          onClick={() => {
                            setInvoiceModal(true);
                            setSelectedInvoice(invoice)
                          }}
                        >
                          <FileDown className="size-5" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-row justify-center">
                          <Button
                            size="icon"
                            // className="text-md"
                            variant="ghost"
                            onClick={() => {
                              setInvoiceHistoryModal(true);
                              setSelectedInvoice(invoice)
                            }}
                          >
                            <Eye className="size-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="text-center space-y-2 my-4 text-muted-foreground">
                {loading && <p>Loading...</p>}
                {!hasMore && searchHistories.length > 0 && (
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
                  Once you start exploring, your search invoice history records
                  will appear here.
                </p>
            </div>
          }

        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
