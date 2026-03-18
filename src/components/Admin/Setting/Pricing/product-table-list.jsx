// import "./index.css";
import { CenterLoader } from "@/components/common/Loader";
import ShowError from "@/components/common/ShowError";
import { deleteProduct, listPricing } from "@/components/service/userAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserIdType } from "@/hooks/useUserIdType";
import { getFormattedDateTime, queryKeys } from "@/utils";
import { convertUnixToLocalTime } from "@/utils/date";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ProductTable = ({ pricingListingQuery, onDelete }) => {
  const navigate = useNavigate();
  const { data, isError, error, isSuccess, isPending } = pricingListingQuery;

  return (
    <div>
      {isPending && <CenterLoader />}
      {isError && <ShowError message={error?.response?.data?.message} />}
      {isSuccess && (
        <Table className="w-full">
          <TableHeader className="bg-[#F5F0EC] w-full">
            <TableRow className="w-full">
              <TableHead>Sr. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Product Type</TableHead>
              <TableHead className="text-center">Pricing Type</TableHead>
              <TableHead className="text-center">Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="font-medium text-center py-10"
                >
                  No Records found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.metadata?.productType}</TableCell>
                  <TableCell className="text-center">{item?.type}</TableCell>
                  <TableCell className="text-center">
                    {convertUnixToLocalTime(item?.created)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={item?.active ? "default" : "secondary"}
                      className={
                        item?.active
                          ? "bg-green-400 text-white"
                          : "bg-red-400 text-white"
                      }
                    >
                      {item?.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-row">
                      <Button
                        size="icon"
                        className="text-md"
                        variant="ghost"
                        onClick={() => {
                          navigate(
                            `/admin/settings/pricing-details/${item?.id}`,
                          );
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

function ProductTableList({ activeTab, activeFilter }) {
  const { userId } = useUserIdType();

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
      pricingListingQuery.refetch();
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
