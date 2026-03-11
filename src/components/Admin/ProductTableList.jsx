import { listSearchHistories } from "@/graphql/queries";
import { API } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
// import "./index.css";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useUser } from "@/context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {
    Eye,
    Trash
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProductModal from "../Modal/ProductModal";






const ProductTable = ()=>{
     const brokerListingQuery = useQuery({

     })


    return(
        <div>
            {/* {brokerListingQuery?.isLoading && <CenterLoader />}
            {brokerListingQuery?.isError && <ShowError message={brokerListingQuery?.error?.response?.data?.message} />} */}
            {true &&
              <Table className="w-full">
                <TableHeader className="bg-[#F5F0EC] w-full">
                  <TableRow className="w-full">
                    <TableHead >Sr. No.</TableHead>
                    <TableHead>
                      Plan Type                   
                    </TableHead>
                    <TableHead className="text-center">
                      Pricing Type                    
                    </TableHead>
                    <TableHead className="text-center">
                     Created
                    </TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brokerListingQuery?.data?.items?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="font-medium text-center py-10"
                      >
                        No Records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    brokerListingQuery?.data?.items?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center" >{item?.agentCount}</TableCell>
                        <TableCell className="text-center" >{item?.totalSearches}</TableCell>
                        <TableCell className="text-center" >
                          {getFormattedDateTime(item?.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 flex-row">
                            <Link to={`/admin/dashboard/broker-details/${item?.id}`} >
                            <Button
                              size="icon"
                              className="text-md"
                              variant="ghost"
                              >
                              <Eye />
                            </Button>
                              </Link>
                                  <Button
                              size="icon"
                              className="text-md"
                              variant="ghost"
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
            }
        </div>
    )
}


function ProductTableList({ activeTab, onRegisterReset, isDownload, handleDownloadComplete }) {
  const navigate = useNavigate();
  const [searchHistories, setSearchHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [showModal , setShowModal] = useState(true);

  const { user } = useUser();



  const fetchSearchHistories = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await API.graphql({
        query: listSearchHistories,
        variables: {
          filter: { brokerId: { eq: "none" } },
          limit: FETCH_LIMIT,
          nextToken,
        },
      });
      const { items, nextToken: newNextToken } =
        response.data.listSearchHistories;

      setSearchHistories((prev) => [...prev, ...items]);
      setNextToken(newNextToken);
      if (items.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(!!newNextToken);
      }
    } catch (error) {
      console.error("Error fetching search histories:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, nextToken]);

  const fetchAgentSearchHistories = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await API.graphql({
        query: listSearchHistories,
        variables: {
          filter: { brokerId: { ne: "none" } },
          limit: FETCH_LIMIT,
          nextToken,
        },
      });
      const { items, nextToken: newNextToken } =
        response.data.listSearchHistories;
      if (items.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(!!newNextToken);
      }
      setSearchHistories((prev) => [...prev, ...items]);
      setNextToken(newNextToken);
    } catch (error) {
      console.error("Error fetching search histories:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, nextToken]);

  const resetStateOnTabChange = () => {
    setHasMore(true);
    setLoading(false);
    setNextToken(null);
    setSearchHistories([]);
  };
  useEffect(() => {
    if (onRegisterReset) {
      onRegisterReset(resetStateOnTabChange);
    }
  }, [onRegisterReset]);
  useEffect(() => {
    if (user?.attributes?.sub) {
      if (activeTab === "history") fetchSearchHistories();
      else fetchAgentSearchHistories();
    }
  }, [user, activeTab, fetchSearchHistories, fetchAgentSearchHistories]);




  return (
    <>
    <ProductModal open={showModal} onClose={() => setShowModal(false)} />
      <div className="bg-[#F5F0EC] rounded-lg text-secondary">
        <div className="bg-white !p-4 rounded-xl">
         <ProductTable />
        </div>
      </div>
    </>
  );
}

export default ProductTableList;
