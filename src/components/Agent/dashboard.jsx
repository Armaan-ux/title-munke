
import { FileSearch2, Logs } from "lucide-react";
import { Button } from "@/components/ui/button";
import History from "@/components/common/history";
import Search from "@/components/common/search";

const BrokerDashboard = () => {


  return (
    <div className="my-4" >

        {/* cards */}
        {/* <div className="flex *:basis-1/2 gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4" >
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Total Searches</p>
              <p className="text-4xl font-semibold text-tertiary" >23</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <FileSearch2 className="text-tertiary" />
            </div>
          </div>
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Audit Logs</p>
              <p className="text-4xl font-semibold text-tertiary" >23</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <Logs className="text-tertiary" />
            </div>
          </div>
        </div> */}

        {/* Search */}
        <Search />


        <div className="bg-[#F5F0EC] p-6 rounded-2xl " >
          <div className="flex justify-between items-center gap-4 mb-6" >
            <p className="text-secondary font-medium text-xl" >Search History</p>
            <Button variant="outline" > View More </Button>
          </div>

            <History />

        </div>

    </div>

  );
};

export default BrokerDashboard;
