
import { FileSearch2, Logs } from "lucide-react";
import { Button } from "@/components/ui/button";
import History from "@/components/common/history";
import Search from "@/components/common/search";
import { useNavigate } from "react-router-dom";

const BrokerDashboard = () => {
const navigate =  useNavigate()

  return (
    <div className="my-4" >

        {/* cards */}
              <div className="grid grid-cols-2 md:grid-cols-2  gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4">
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-coffee-light font-medium"> Total Search</p>
            <p className="text-4xl font-semibold text-tertiary">
              10
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <img src="/t-search.svg" alt="total-search" className="w-6 h-6"/>
          </div>
        </div>
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-coffee-light font-medium"> Audit Logs</p>
            <p className="text-4xl font-semibold text-tertiary">
              20
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <img src="/audit-log.svg" alt="audit-log" className="w-6 h-6"/>
          </div>
        </div>
      </div>

        {/* Search */}
        <Search />


        <div className="bg-[#F5F0EC] p-6 rounded-2xl " >
          <div className="flex justify-between items-center gap-4 mb-6" >
            <p className="text-secondary font-medium text-xl" >Search History</p>
            <Button variant="outline" onClick={() => navigate("/agent/history-listview")} > View More </Button>
          </div>

            <History />

        </div>

    </div>

  );
};

export default BrokerDashboard;
