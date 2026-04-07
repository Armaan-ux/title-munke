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
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

const SrNoRenderer = (props) => (
  <span className="font-medium text-black">{props.node.rowIndex + 1}</span>
);

const AmountRenderer = (props) => (
  <span>${props.data?.total / 100}</span>
);

const StatusRenderer = (props) => (
  <div className="flex flow-row gap-2 items-center">
    <CircleCheck
      className={`${
        props.data?.status === "paid"
          ? "text-[#1E8221]"
          : props.data?.status === "open"
          ? "text-[#A2781E]"
          : "text-[#FF5F59]"
      }`}
    />{" "}
    <span className={`${
      props.data?.status === "paid"
        ? "text-[#1E8221]"
        : props.data?.status === "open"
        ? "text-[#A2781E]"
        : "text-[#FF5F59]"
    } text-[13px] font-medium`}>
      {props.data?.status}
    </span>
  </div>
);

const DownloadRenderer = ({ data, setInvoiceModal, setSelectedInvoice }) => (
  <div className="flex items-center justify-center h-full">
    <Button variant="ghost" size="icon" 
      onClick={() => {
        setInvoiceModal(true);
        setSelectedInvoice(data)
      }}
    >
      <FileDown className="size-5" />
    </Button>
  </div>
);

const ActionRenderer = ({ data, setInvoiceHistoryModal, setSelectedInvoice }) => (
  <div className="flex items-center gap-2 flex-row justify-center h-full">
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        setInvoiceHistoryModal(true);
        setSelectedInvoice(data)
      }}
    >
      <Eye className="size-5" />
    </Button>
  </div>
);

const BillingHistory = () => {

  const navigate = useNavigate();
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

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
      },
      {
        headerName: "Invoice ID",
        field: "id",
        flex: 1,
        minWidth: 150,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date",
        field: "created",
        valueGetter: (params) => convertFromTimestamp(params.data?.created, "dateTime"),
        flex: 1,
        minWidth: 180,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Amount",
        cellRenderer: AmountRenderer,
        flex: 1,
        minWidth: 150,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Status",
        cellRenderer: StatusRenderer,
        flex: 1,
        minWidth: 140,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Download",
        cellRenderer: (params) => (
          <DownloadRenderer 
            data={params.data} 
            setInvoiceModal={setInvoiceModal} 
            setSelectedInvoice={setSelectedInvoice} 
          />
        ),
        flex: 1,
        minWidth: 160,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
      {
        headerName: "Action",
        cellRenderer: (params) => (
          <ActionRenderer 
            data={params.data} 
            setInvoiceHistoryModal={setInvoiceHistoryModal} 
            setSelectedInvoice={setSelectedInvoice} 
          />
        ),
        flex: 1,
        minWidth: 160,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
    ],
    [],
  );

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
          {invoiceListingQuery.isSuccess && (
            <div className="bg-white !p-4 rounded-xl w-full h-full">
              <p className="text-lg text-secondary font-medium mb-4">Invoice History</p>
              <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
                <AgGridReact
                  rowData={invoiceListingQuery?.data?.invoices || []}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 120,
                    filter: false,
                    sortable: true,
                    resizable: true,
                    unSortIcon: true,
                  }}
                  rowHeight={72}
                  headerHeight={48}
                  domLayout="autoHeight"
                  animateRows={true}
                  overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
                />
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
