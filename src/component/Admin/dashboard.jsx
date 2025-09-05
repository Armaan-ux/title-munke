
import { BookUser, FileSearch2, HatGlasses, Logs, Map, UserRound, UserRoundCheck, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import History from "@/component/common/history";
import Search from "@/component/common/search";
import { useEffect, useState } from "react";
import { useUser } from "@/context/usercontext";
import { fetchAgentsWithSearchCount } from "../service/broker";
import AllSearchHistory from "./all-history";

const AdminDashboard = () => {

//   const [agents, setAgents] = useState([]);

//    const { user } = useUser();

   
//   useEffect(() => {
//       fetchAgentsWithSearchCount(user.attributes.sub).then(res => setAgents(res || []))
//   }, [])


//   const totalAgents = agents.length
//   const activeAgents = agents.filter(agent => agent.status === "ACTIVE").length
//   const inactiveAgents = agents.filter(agent => agent.status === "INACTIVE").length

//   console.log({totalAgents, activeAgents, inactiveAgents})

  return (
    <div className="my-4" >

        {/* cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4" >
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Total Brokers</p>
              <p className="text-4xl font-semibold text-tertiary" >0</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <UserRound className="text-tertiary" />
            </div>
          </div>
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Total Agents</p>
              <p className="text-4xl font-semibold text-tertiary" >0</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <HatGlasses className="text-tertiary" />
            </div>
          </div>
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Total Counties</p>
              <p className="text-4xl font-semibold text-tertiary" >0</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <Map className="text-tertiary" />
            </div>
          </div>
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Demo Requests</p>
              <p className="text-4xl font-semibold text-tertiary" >0</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <BookUser className="text-tertiary" />
            </div>
          </div>
        </div>


        {/* Search */}
        <Search />


        <div className="bg-[#F5F0EC] p-6 rounded-2xl " >
          <div className="flex justify-between items-center gap-4 mb-6" >
            <p className="text-secondary font-medium text-xl" >Search History</p>
            <Button variant="outline" > View More </Button>
          </div>

            <AllSearchHistory />

        </div>

    </div>

  );
};

export default AdminDashboard;
