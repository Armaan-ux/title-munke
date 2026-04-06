// import "./index.css";
import { CenterLoader } from "@/components/common/Loader";
import ShowError from "@/components/common/ShowError";
import { deleteProduct, listPricing } from "@/components/service/userAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserIdType } from "@/hooks/useUserIdType";
import { queryKeys } from "@/utils";
import { convertUnixToLocalTime } from "@/utils/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";

const SrNoRenderer = (props) => {
  return <span>{props.node.rowIndex + 1}</span>;
};

const StatusRenderer = (props) => {
  const active = props.data?.active;
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      className={
        active
          ? "bg-[#E9F3E9] text-[#1E8221]"
          : "text-destructive/80 bg-destructive/20"
      }
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
};

const ActionRenderer = (props) => {
  const navigate = useNavigate();
  const item = props?.data;
  const onDelete = props?.onDelete;

  return (
    <div className="flex items-center gap-2 flex-row h-full">
      <Button
        size="icon"
        className="text-md"
        variant="ghost"
        onClick={() => {
          navigate(`/admin/settings/pricing-details/${item?.id}`);
        }}
      >
        <Eye />
      </Button>
      <Button
        size="icon"
        className="text-md"
        variant="ghost"
        onClick={() => onDelete(item?.id)}
      >
        <Trash />
      </Button>
    </div>
  );
};

const ProductTable = ({ pricingListingQuery, onDelete }) => {
  const { data, isError, error, isSuccess, isPending } = pricingListingQuery;

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "serial",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        valueGetter: (params) =>
          params.data.name
            ? params.data.name.replace(/Organisation/gi, "Organization")
            : "-",
        flex: 1,
        minWidth: 150,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Product Type",
        field: "metadata.productType",
        valueGetter: (params) =>
          params.data.metadata?.productType
            ? params.data.metadata.productType.replace(
                /ORGANISATION/gi,
                "ORGANIZATION",
              )
            : "-",
        flex: 1,
        minWidth: 150,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Pricing Type",
        field: "type",
        flex: 1,
        minWidth: 120,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: "start" },
        headerClass: "header-center",
      },
      {
        headerName: "Created",
        field: "created",
        valueGetter: (params) => convertUnixToLocalTime(params.data?.created),
        flex: 1,
        minWidth: 150,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: "start" },
        headerClass: "header-center",
      },
      {
        headerName: "Status",
        field: "active",
        cellRenderer: StatusRenderer,
        flex: 1,
        minWidth: 120,
        cellStyle: { textAlign: "start" },
        headerClass: "header-center",
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: ActionRenderer,
        cellRendererParams: {
          onDelete: onDelete,
        },
        flex: 1,
        minWidth: 120,
      },
    ],
    [onDelete],
  );

  const isFetching = pricingListingQuery.isFetching;

  return (
    <div className="relative min-h-[150px]">
      {(isPending || isFetching) && <CenterLoader />}
      {isError && <ShowError message={error?.response?.data?.message} />}
      {isSuccess && !isPending && !isFetching && (
        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
          
            <AgGridReact
              rowData={data?.data || []}
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
      )}
    </div>
  );
};

function ProductTableList({ activeTab, activeFilter }) {
  const { userId } = useUserIdType();
  const queryClient = useQueryClient();

  const tabToApiParam = {
    organisation: "organisation",
    broker: "broker",
    agent: "agent",
  };

  const pricingListingQuery = useQuery({
    queryKey: [queryKeys.pricingListing, activeTab.id, activeFilter],
    queryFn: () =>
      listPricing({
        roleType: tabToApiParam[activeTab.id],
        active: activeFilter,
      }),
    enabled: !!userId,
    keepPreviousData: true,
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.pricingListing] });
    },
  });

  const deleteProductHandler = (productId) => {
    deleteProductMutation.mutate(productId);
  };

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <ProductTable
            pricingListingQuery={pricingListingQuery}
            onDelete={deleteProductHandler}
          />
        </div>
      </div>
    </>
  );
}

export default ProductTableList;
