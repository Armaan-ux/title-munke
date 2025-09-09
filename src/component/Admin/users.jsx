import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import { listAdmins, listAuditLogs } from "@/graphql/queries";
// import "./index.css";
import { useUser } from "@/context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "@/utils";
import { activeBroker, fetchAgentsOfBroker, fetchAgentsWithSearchCount, fetchBrokersWithSearchCount, fetchTotalActiveBrokers, fetchTotalBrokers, fetchTotalBrokerSearchesThisMonth, inActiveBroker } from "@/component/service/broker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { EyeIcon, Pencil, PencilLine, PlusCircle, Trash2 } from "lucide-react";
import AddUserModal from "../Modal/AddUserModal";
import AgentList from "../Modal/AgentList";
import AddAgentByAdminModal from "../Modal/AddAgentByAdminModal";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const userTypes = [
    {
        name: "Admin",
        id: "admin" 
    },
    {
        name: "Broker",
        id: "broker"
    },
    // {
    //     name: "Agent",
    //     id: "agent" 
    // }
]


export default function Users() {

    const [activeTab, setActiveTab] = useState(userTypes[0]);

    return (
        <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">

          <div className="space-x-3 mb-4" >
            {
                userTypes.map((item, index) => (
                        <button 
                            className={` ${activeTab.id === item.id ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] " } transition-all  rounded-full px-10 py-3 `}
                            onClick={() => setActiveTab(item)}
                         >{item.name}
                        </button>
                ))
            }
            </div>

          
             
               {activeTab.id === "admin" && <Admins />}
               {activeTab.id === "broker" && <AdminBrokersList />}
               
             
         
        </div>
    )
}



function Admins(){

  const [isOpen, setIsOpen] = useState(false);
    const [admins, setAdmins] = useState([]);
  
    useEffect(() => {
      const getAdmins = async () => {
        const response = await API.graphql({
          query: listAdmins,
        });
        const { items } = response.data.listAdmins;
        setAdmins(items);
      };
      getAdmins();
    }, []);
  return(
            <div className="bg-white !p-4 rounded-xl" >
              <AddUserModal 
                setIsOpen={setIsOpen}
                userType="admin"
                setUser={setAdmins}
                isOpen={isOpen}
              />
                <div className="flex justify-between gap-4 items-center mb-4" >
                    <p>All Admins</p>
                    <Button variant="secondary" onClick={() => setIsOpen(true)} >  <PlusCircle /> Add Admin</Button>
                </div>
    
                <Table className=""  >
                  <TableHeader className="bg-[#F5F0EC]" >
                    <TableRow>
                      <TableHead className="w-[100px]">Sr. No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      admins?.length === 0 ?
                      <TableRow >
                        <TableCell colSpan={5} className="font-medium text-center py-10">No Records found.</TableCell>
                      </TableRow>
                      :
                      admins?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          {/* <TableCell>
                            <div className="space-x-1" >
                                <Button variant="ghost" size="icon" ><Pencil /></Button>
                                <Button variant="ghost" size="icon" ><Trash2 /></Button>
                            </div>
                          </TableCell> */}
                        </TableRow> 
                      ))
                    }
    
                  </TableBody>
                </Table>

                
                {/* {!hasMore && <p>No more data to load.</p>}
                {logs?.length > 0 && hasMore && !loading && (
                    <button className="loadmore" onClick={fetchLogs}>
                        Load More
                    </button>
                )} */}


              </div>
  )
}

function AdminBrokersList(){

   const [isBrokerListLoading, setIsBrokerListLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isAgentCreationModalOpen, setIsAgentCreationModalOpen] =
      useState(false);
    const [isAgentListOpen, setIsAgentListOpen] = useState(false);
    const [isAgentListLoading, setIsAgentListLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [brokers, setBrokers] = useState([]);
    const [agentList, setAgentList] = useState([]);
    const [nextToken, setNextToken] = useState(null);
    const [totalBrokerCount, setTotalBrokerCount] = useState(0);
    const [totalActiveBrokerCount, setTotalActiveBrokerCount] = useState(0);
    const [totalBrokerSearchThisMonthCount, setTotalBrokerSearchThisMonthCount] =
      useState(0);
  
    useEffect(() => {
      const getBroker = async () => {
        try {
          setLoading(true);
          const totalBroker = await fetchTotalBrokers();
          const totalActiveBroker = await fetchTotalActiveBrokers();
          setTotalBrokerSearchThisMonthCount(
            await fetchTotalBrokerSearchesThisMonth()
          );
          setTotalBrokerCount(totalBroker?.length);
          setTotalActiveBrokerCount(totalActiveBroker?.length);
        } catch (err) {
          console.error("Error", err);
        } finally {
          setLoading(false);
        }
      };
  
      getBroker();
      const interval = setInterval(getBroker, 1800000);
  
      return () => clearInterval(interval);
    }, []);
  
    useEffect(() => {
      handleFetchBrokersWithSearchCount();
    }, []);
  
    const handleFetchBrokersWithSearchCount = async () => {
      if (isBrokerListLoading || !hasMore) return;
  
      setIsBrokerListLoading(true);
      try {
        const response = await fetchBrokersWithSearchCount(nextToken);
        const { updatedBrokers, nextToken: newNextToken } = response;
  
        setBrokers((prev) => [...prev, ...updatedBrokers]);
        setNextToken(newNextToken);
        setHasMore(!!newNextToken);
      } catch (error) {
        console.error("Error fetching search histories:", error);
      }
      setIsBrokerListLoading(false);
    };
  
    const handleBrokerStatus = async (elem) => {
      if (elem.status === "ACTIVE") {
        await inActiveBroker(elem.id);
        const temp = brokers;
        const indx = temp.findIndex((e) => e.id === elem.id);
        temp[indx].status = "INACTIVE";
        setBrokers(temp.map((elem) => elem));
      } else if (elem.status === "INACTIVE") {
        await activeBroker(elem.id);
        const temp = brokers;
        const indx = temp.findIndex((e) => e.id === elem.id);
        temp[indx].status = "ACTIVE";
        setBrokers(temp.map((elem) => elem));
      }
    };
  
    const handleFetchAgentListForBroker = async (brokerId) => {
      try {
        setIsAgentListLoading(true);
        setIsAgentListOpen(true);
        const response = await fetchAgentsWithSearchCount(brokerId);
        setAgentList(response);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAgentListLoading(false);
      }
    };

    // const brokerss = [
    //     {
    //         "__typename": "Broker",
    //         "updatedAt": "2025-08-22T00:38:03.976Z",
    //         "status": "ACTIVE",
    //         "createdAt": "2025-07-24T18:22:35.029Z",
    //         "email": "avneet.grewal@gmail.com",
    //         "id": "f4b8e4b8-4011-700f-1631-9a708d668bc2",
    //         "name": "testbrokem",
    //         "lastLogin": "2025-07-24T18:22:34.785Z",
    //         "totalSearches": 0
    //     },
    //     {
    //         "__typename": "Broker",
    //         "updatedAt": "2025-07-24T18:19:30.132Z",
    //         "status": "ACTIVE",
    //         "createdAt": "2025-07-17T22:55:25.210Z",
    //         "email": "ASP203@miami.edu",
    //         "id": "045884f8-0091-70c9-e5b0-95e2456b45ac",
    //         "name": "Armaan Test",
    //         "lastLogin": "2025-07-17T22:55:25.066Z",
    //         "totalSearches": 0
    //     },
    //     {
    //         "__typename": "Broker",
    //         "updatedAt": "2025-07-17T23:03:16.922Z",
    //         "status": "INACTIVE",
    //         "createdAt": "2025-02-19T22:05:52.759Z",
    //         "email": "russells@lafayette.edu",
    //         "id": "4498f4a8-e021-7094-f9aa-82e79ab259b6",
    //         "name": "TESTbroker",
    //         "lastLogin": "2025-02-19T22:07:25.842Z",
    //         "totalSearches": 0
    //     },
    //     {
    //         "__typename": "Broker",
    //         "updatedAt": "2025-09-08T16:30:11.067Z",
    //         "status": "ACTIVE",
    //         "createdAt": "2025-02-07T15:26:10.282Z",
    //         "email": "russells1927@gmail.com",
    //         "id": "345874b8-4031-70c1-96c5-53b13ca4756f",
    //         "name": "Testing Broker",
    //         "lastLogin": "2025-09-08T15:35:42.131Z",
    //         "totalSearches": 5
    //     },
    //     {
    //         "__typename": "Broker",
    //         "updatedAt": "2025-09-09T06:48:05.622Z",
    //         "status": "ACTIVE",
    //         "createdAt": "2025-08-28T16:08:18.257Z",
    //         "email": "ravinder@creativebuffer.com",
    //         "id": "a4a894b8-5061-7039-6b23-f37722d94011",
    //         "name": "Ravinder",
    //         "lastLogin": "2025-09-09T06:47:17.120Z",
    //         "totalSearches": 0
    //     },
    //     {
    //         "__typename": "Broker",
    //         "updatedAt": "2025-08-07T15:57:10.545Z",
    //         "status": "ACTIVE",
    //         "createdAt": "2025-07-17T22:53:55.151Z",
    //         "email": "david@lehighvalleyhomes.com",
    //         "id": "c4886438-60e1-70af-2e27-73dfbf6bf2aa",
    //         "name": "Dave Coleman",
    //         "lastLogin": "2025-07-17T22:53:54.598Z",
    //         "totalSearches": 0
    //     },
    //     {
    //         "__typename": "Broker",
    //         "updatedAt": "2025-08-26T19:21:31.913Z",
    //         "status": "ACTIVE",
    //         "createdAt": "2025-08-16T12:26:58.051Z",
    //         "email": "ben+broker11@navi-fi.com",
    //         "id": "c4d8d4d8-00e1-70e5-fa66-578e2798e1bd",
    //         "name": "ben+broker11",
    //         "lastLogin": "2025-08-26T19:21:35.018Z",
    //         "totalSearches": 0
    //     }
    // ]
  


  return(
        <>

        <AgentList
          data={agentList}
          isOpen={isAgentListOpen}
          // isOpen={true}
          setIsOpen={setIsAgentListOpen}
          isAgentListLoading={isAgentListLoading}
        />
      

        <AddUserModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          userType={"broker"}
          setUser={setBrokers}
        />
      
      <AddAgentByAdminModal isOpen={isAgentCreationModalOpen} setIsOpen={setIsAgentCreationModalOpen} />
      
      <div>
        {/* <div className="page-title">
          <h1>Broker Performance Overview</h1>
          <div className="action-buttons">
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="btn add-user-btn"
            >
              <i className="fas fa-user-plus"></i> Add Broker
            </button>
            <button
              onClick={() => {
                setIsAgentCreationModalOpen(true);
              }}
              className="btn add-user-btn"
            >
              <i className="fas fa-user-plus"></i> Add Agent
            </button>
          </div>
        </div> */}

        {/* <div className="grid-container">
          <div className="stat-card">
            <h3>Total Brokers</h3>
            <p className="stat-number">
              {loading ? "loading..." : totalBrokerCount}
            </p>
          </div>
          <div className="stat-card">
            <h3>Active Brokers</h3>
            <p className="stat-number">
              {loading ? "loading..." : totalActiveBrokerCount}
            </p>
          </div>
          <div className="stat-card">
            <h3>Total Searches This Month</h3>
            <p className="stat-number">
              {loading ? "loading..." : totalBrokerSearchThisMonthCount}
            </p>
          </div>
        </div> */}


           <div className="bg-white !p-4 rounded-xl" >

                <div className="flex justify-between gap-4 items-center mb-4" >
                    <p>All Brokers</p>

                    <div className="space-x-2" > 
                      <Button variant="secondary" onClick={() => setIsAgentCreationModalOpen(true)} >  <PlusCircle /> Add Agent</Button>
                      <Button variant="secondary" onClick={() => setIsOpen(true)} >  <PlusCircle /> Add Broker</Button>
                    </div>
                </div>
    
                <Table className=""  >
                  <TableHeader className="bg-[#F5F0EC]" >
                    <TableRow>
                      <TableHead className="w-[100px]">Sr. No.</TableHead>
                      <TableHead>Broker Name</TableHead>
                      <TableHead>Monthly Searches</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Agent List</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      brokers?.length === 0 ?
                      <TableRow >
                        <TableCell colSpan={8} className="font-medium text-center py-10">No Records found.</TableCell>
                      </TableRow>
                      :
                      brokers?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.totalSearches}</TableCell>
                          <TableCell>{getFormattedDateTime(item.lastLogin)}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>

                             <div >
                              {item.status !== "UNCONFIRMED" && (
                                <>
                                  {/* <button 
                                    size="sm" 
                                    onClick={() => handleBrokerStatus(item)} 
                                    className={`
                                      rounded-lg px-4 py-2 w-full transition-all cursor-pointer text-sm
                                      ${item.status === "ACTIVE" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}
                                      `}
                                  >
                                    {item.status === "ACTIVE" ? "Inactive" : "Active"}
                                  </button> */}

                                  
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button size="icon" className="text-sm" variant="ghost" > <PencilLine /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleBrokerStatus(item)}>{item.status === "ACTIVE" ? "Inactive" : "Active"}</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                                  {/* <button className="btn action-btn">
                                    Actions <i className="fas fa-caret-down"></i>
                                  </button>

                                  <div className="dropdown-content">
                                    <span
                                      onClick={() => {
                                        handleBrokerStatus(item);
                                      }}
                                    >
                                      {item.status === "ACTIVE" ? "InActive" : "Active"}
                                    </span>
                                  </div> */}
                                </>
                              )}
                            </div>
                            {/* <div className="space-x-1" >
                                <Button variant="ghost" size="icon" ><Pencil /></Button>
                                <Button variant="ghost" size="icon" ><Trash2 /></Button>
                                </div> */}
                          </TableCell>
                          <TableCell>
                            <Button size="icon" variant="ghost" onClick={() =>  handleFetchAgentListForBroker(item.id)} >
                              <EyeIcon />
                            </Button>
                          </TableCell>
                        </TableRow> 
                      ))
                    }
    
                  </TableBody>
                </Table>

                
                {/* {!hasMore && <p>No more data to load.</p>}
                {logs?.length > 0 && hasMore && !loading && (
                    <button className="loadmore" onClick={fetchLogs}>
                        Load More
                    </button>
                )} */}


              </div>




        {/* <div className="broker-list-card">
          <h3>Brokers Performance</h3>
          <table className="broker-list-styled-table table-container">
            <thead>
              <tr>
                <th>Broker Name</th>
                <th>Monthly Searches</th>
                <th>Last Login</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
                <th>Agent List</th>
              </tr>
            </thead>
            <tbody>
              {brokers.map((elem) => (
                <tr key={elem.id} className="dropdown-btn">
                  <td>{elem.name}</td>
                  <td>{elem.totalSearches}</td>
                  <td>{getFormattedDateTime(elem.lastLogin)}</td>
                  <td>{elem.email}</td>
                  <td>
                    <span className="status active">{elem.status}</span>
                  </td>
                  <td>
                    <div className="dropdown">
                      {elem.status !== "UNCONFIRMED" && (
                        <>
                          <button className="btn action-btn">
                            Actions <i className="fas fa-caret-down"></i>
                          </button>

                          <div className="dropdown-content">
                            <span
                              onClick={() => {
                                handleBrokerStatus(elem);
                              }}
                            >
                              {elem.status === "ACTIVE" ? "InActive" : "Active"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className=" action-btn"
                      onClick={() => handleFetchAgentListForBroker(elem.id)}
                    >
                      Click to see list
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {brokers?.length === 0 && !isBrokerListLoading && (
            <p>No Records found.</p>
          )}
          {isBrokerListLoading && <p>Loading...</p>}
          {!hasMore && <p>No more data to load.</p>}
          {brokers?.length > 0 && hasMore && !isBrokerListLoading && (
            <button
              className="loadmore"
              onClick={handleFetchBrokersWithSearchCount}
            >
              Load More
            </button>
          )}
        </div> */}


      </div>
    </>
  )
}