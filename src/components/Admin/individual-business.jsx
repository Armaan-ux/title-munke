import { ArrowDownToLine } from "lucide-react";
import DateFilter from "../common/date-filter";
import { Button } from "../ui/button";
import IndividualBusinessTable from "./individual-business-table";
import BackBtn from "../back-btn";
import { useState } from "react";

export default function IndividualBusiness() {
   const [isDownload, setIsDoownload] = useState(false);
   const [date, setDate] = useState({from: null, to: null});
    return(
            <>
              <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
                <BackBtn />
              </div>
              <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
                <div className="flex justify-between items-center gap-4 mb-6">
                  <div className="flex items-center gap-6">
                    <p className="text-secondary font-medium text-xl">Business</p>
                    <p
                      className={`bg-white text-tertiary font-semibold text-lg transition-all rounded-full px-10 py-3 `}
                    >
                      $260.00
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <DateFilter handleFilter={(from, to) => setDate(pre => ({...pre, from, to}))}/>
                    <Button variant="outline" onClick={() => setIsDoownload(true)}>
                      <ArrowDownToLine /> Download CSV
                    </Button>
                  </div>
                </div>
                <div className="bg-white !p-4 rounded-xl">
                    <IndividualBusinessTable isDownload={isDownload} handleDownloadComplete={() => setIsDoownload(false)} from={date?.from} to={date?.to} />
                  {/* {!hasMore && <p>No more data to load.</p>}
                  {logs?.length > 0 && hasMore && !loading && (
                    <button className="loadmore mt-4">Load More</button>
                  )} */}
                </div>
              </div>
            </>
    )
}