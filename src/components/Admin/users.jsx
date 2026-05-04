import { API } from "aws-amplify";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getFormattedDateTime } from "@/utils";
import { fetchAgentsWithSearchCount } from "@/components/service/broker";
import { AgGridReact } from "ag-grid-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ArchiveRestore,
  Download,
  PencilLine,
  PlusCircle,
  Trash2,
  UserPlus,
} from "lucide-react";
import AddAdminModal from "../Modal/AddAdminModal";
import ConfirmDeleteModal from "../Modal/ConfirmDeleteModal";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useRestoreUser } from "@/hooks/useRestoreUser";
import { useMutation } from "@tanstack/react-query";
import { useUserIdType } from "@/hooks/useUserIdType";
import { Badge } from "../ui/badge";
import { toast } from "react-toastify";
import {
  deleteUser,
  getActiveBrokers,
  getAgentListings,
  getBrokersWithSearchCount,
  listAdmins,
  listOrganisation,
  reinviteUser,
} from "../service/userAdmin";

// ─── Shared CSV export utility ───────────────────────────────────────────────
/**
 * @param {object[]} rows        - array of data objects
 * @param {string[]} headers     - column header labels
 * @param {Function[]} getters   - one getter per header: (row) => value
 * @param {string} filename      - downloaded file name
 */
const exportToCSV = (rows, headers, getters, filename) => {
  if (!rows?.length) return;

  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;

  const csvRows = rows.map((row, index) =>
    getters.map((get) => escape(get(row, index))).join(","),
  );

  const csvContent = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const todayStr = () => new Date().toISOString().slice(0, 10);
// ─────────────────────────────────────────────────────────────────────────────

const SrNoRenderer = (props) => <span>{props.node.rowIndex + 1}</span>;

const StatusRenderer = (props) => {
  const status = props.value;
  return (
    <Badge
      className={`${
        status === "ACTIVE"
          ? "bg-[#E9F3E9] text-[#1E8221]"
          : status === "DELETED"
            ? "text-destructive/80 bg-destructive/20"
            : "bg-[#FFF3D9] text-[#A2781E]"
      } text-[13px] font-medium px-3 py-1 rounded-full`}
    >
      {status}
    </Badge>
  );
};

const userTypes = [
  { name: "Admin", id: "admin" },
  { name: "Organization", id: "organisation" },
  { name: "Broker", id: "broker" },
  { name: "Agent", id: "agent" },
];

export default function Users() {
  const [activeTab, setActiveTab] = useState(userTypes[0]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      <div className="space-x-3 mb-4">
        {userTypes.map((item) => (
          <button
            key={item.id}
            className={`${
              activeTab.id === item.id
                ? "bg-tertiary text-white"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055]"
            } transition-all rounded-full px-10 py-3`}
            onClick={() => setActiveTab(item)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {activeTab.id === "admin" && <Admins />}
      {activeTab.id === "organisation" && <Organisation />}
      {activeTab.id === "broker" && <AdminBrokersList />}
      {activeTab.id === "agent" && <Agents />}
    </div>
  );
}

// ─── Export button (reusable small component) ─────────────────────────────────
function ExportCSVButton({ onClick, disabled }) {
  return (
    <Button onClick={onClick} disabled={disabled} variant="secondary">
      <Download className="size-4" />
      Export CSV
    </Button>
  );
}

// ─── Admins ───────────────────────────────────────────────────────────────────
function Admins() {
  const { userId } = useUserIdType();
  const [isOpen, setIsOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isAdminListLoading, setIsAdminListLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [nextToken, setNextToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { deleteUserMutation } = useDeleteUser(() => {
    handleFetchAdminListing(true);
    setHasMore(true);
  });
  const { restoreUserMutation } = useRestoreUser(() => {
    handleFetchAdminListing(true);
    setHasMore(true);
  });

  const handleFetchAdminListing = async (isRefetch) => {
    setIsAdminListLoading(true);
    try {
      const response = await listAdmins(isRefetch ? null : nextToken);
      const { items, nextToken: newNextToken } = response;
      setAdmins((pre) => {
        const allData = isRefetch ? items : [...pre, ...items];
        return Array.from(new Map(allData.map((i) => [i.id, i])).values());
      });
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {
      console.log(error);
    }
    setIsAdminListLoading(false);
  };

  useEffect(() => {
    handleFetchAdminListing();
  }, []);

  const filteredData = useMemo(
    () =>
      admins?.filter(
        (i) => statusFilter === "ALL" || i.status === statusFilter,
      ),
    [admins, statusFilter],
  );

  const handleExport = useCallback(() => {
    exportToCSV(
      filteredData,
      ["Sr. No.", "Name", "Email", "Status"],
      [
        (row, idx) => idx + 1,
        (row) => row.name,
        (row) => row.email,
        (row) => row.status,
      ],
      `admins-${statusFilter.toLowerCase()}-${todayStr()}.csv`,
    );
  }, [filteredData, statusFilter]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "index",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        cellStyle: { fontWeight: "500", color: "black" },
        filter: false,
        flex: 1,
        minWidth: 180,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email",
        field: "email",
        filter: false,
        flex: 1.5,
        minWidth: 220,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusRenderer,
        filter: false,
        flex: 1,
        minWidth: 160,
      },
      {
        headerName: "Action",
        field: "id",
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        flex: 0,
        filter: false,
        sortable: false,
        cellRenderer: (params) => {
          const item = params.data;
          return (
            <div className="flex items-center gap-2 h-full">
              <Button
                size="icon"
                variant="ghost"
                disabled={item?.status === "DELETED"}
                onClick={() => {
                  setSelectedUser(item);
                  setIsOpen(true);
                }}
              >
                <PencilLine />
              </Button>
              {userId !== item?.id && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (item?.status === "DELETED") {
                      restoreUserMutation.mutate({
                        userId: item.id,
                        email: item.email,
                        userType: "admin",
                      });
                    } else {
                      setUserToDelete(item);
                      setIsDeleteDialogOpen(true);
                    }
                  }}
                >
                  {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [userId, restoreUserMutation, deleteUserMutation],
  );

  return (
    <>
      {isOpen && (
        <AddAdminModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedUser({});
          }}
          title="Admin"
          userType="admin"
          invalidateFun={() => {
            handleFetchAdminListing(true);
            setHasMore(true);
          }}
          selectedUser={selectedUser}
        />
      )}
      <div className="bg-white !p-4 rounded-xl">
        <div className="flex justify-between gap-4 items-center mb-4 flex-wrap">
          <div className="flex items-center gap-4">
            <p className="text-lg font-medium">All Admins</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="UNCONFIRMED">Unconfirmed</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <ExportCSVButton
              onClick={handleExport}
              disabled={!filteredData?.length}
            />
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
              <PlusCircle /> Add Admin
            </Button>
          </div>
        </div>

        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
          <AgGridReact
            rowData={filteredData || []}
            columnDefs={columnDefs}
            defaultColDef={{
              flex: 1,
              minWidth: 120,
              filter: false,
              sortable: true,
              resizable: true,
              unSortIcon: true,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
            rowHeight={72}
            headerHeight={48}
            domLayout="autoHeight"
            animateRows={true}
            overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
          />
        </div>
        <div className="text-center flex flex-col gap-4 my-4 text-muted-foreground">
          {isAdminListLoading && <p>Loading...</p>}
          {!hasMore && !isAdminListLoading && <p>No more data to load.</p>}
          {filteredData?.length > 0 && hasMore && !isAdminListLoading && (
            <Button size="sm" onClick={() => handleFetchAdminListing()}>
              Load More
            </Button>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUserMutation.mutate({
              userId: userToDelete.id,
              email: userToDelete.email,
              userType: "admin",
            });
            setIsDeleteDialogOpen(false);
          }
        }}
        isLoading={deleteUserMutation?.isPending}
        title="Delete Admin"
        description={`Are you sure you want to delete ${userToDelete?.name || "this admin"}? This action cannot be undone.`}
      />
    </>
  );
}

// ─── Organisation ─────────────────────────────────────────────────────────────
function Organisation() {
  const { userId } = useUserIdType();
  const [isOpen, setIsOpen] = useState(false);
  const [org, setOrg] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isOrgListLoading, setIsOrgListLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { deleteUserMutation } = useDeleteUser(() => {
    handleFetchOrgListing(true);
    setHasMore(true);
  });
  const { restoreUserMutation } = useRestoreUser(() => {
    handleFetchOrgListing(true);
    setHasMore(true);
  });

  const handleFetchOrgListing = async (isRefetch) => {
    setIsOrgListLoading(true);
    try {
      const response = await listOrganisation(isRefetch ? null : nextToken);
      const { updatedOrganisations, nextToken: newNextToken } = response;
      setOrg((pre) => {
        const allData = isRefetch
          ? updatedOrganisations
          : [...pre, ...updatedOrganisations];
        return Array.from(new Map(allData.map((i) => [i.id, i])).values());
      });
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {
      console.log(error);
    }
    setIsOrgListLoading(false);
  };

  useEffect(() => {
    handleFetchOrgListing();
  }, []);

  const filteredData = useMemo(
    () =>
      org?.filter((i) => statusFilter === "ALL" || i.status === statusFilter),
    [org, statusFilter],
  );

  const handleExport = useCallback(() => {
    exportToCSV(
      filteredData,
      ["Sr. No.", "Name", "Email", "Status"],
      [
        (row, idx) => idx + 1,
        (row) => row.name,
        (row) => row.email,
        (row) => row.status,
      ],
      `organisations-${statusFilter.toLowerCase()}-${todayStr()}.csv`,
    );
  }, [filteredData, statusFilter]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "index",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
        filter: false,
      },
      {
        headerName: "Name",
        field: "name",
        cellStyle: { fontWeight: "500", color: "black" },
        filter: false,
        flex: 1,
        minWidth: 160,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email",
        field: "email",
        filter: false,
        flex: 1.5,
        minWidth: 200,
      },
      {
        headerName: "Status",
        field: "status",
        filter: false,
        flex: 1,
        minWidth: 160,
        cellRenderer: StatusRenderer,
      },
      {
        headerName: "Action",
        field: "id",
        filter: false,
        sortable: false,
        cellRenderer: (params) => {
          const item = params.data;
          return (
            <div className="flex items-center gap-2 h-full">
              <Button
                size="icon"
                variant="ghost"
                disabled={item?.status === "DELETED"}
                onClick={() => {
                  setSelectedUser(item);
                  setIsOpen(true);
                }}
              >
                <PencilLine />
              </Button>
              {userId !== item?.id && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (item?.status === "DELETED") {
                      restoreUserMutation.mutate({
                        userId: item.id,
                        email: item.email,
                        userType: "organisation",
                      });
                    } else {
                      setUserToDelete(item);
                      setIsDeleteDialogOpen(true);
                    }
                  }}
                >
                  {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [userId, restoreUserMutation, deleteUserMutation],
  );

  return (
    <>
      {isOpen && (
        <AddAdminModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedUser({});
          }}
          title="Organization"
          userType="organisation"
          invalidateFun={() => {
            handleFetchOrgListing(true);
            setHasMore(true);
          }}
          selectedUser={selectedUser}
        />
      )}
      <div className="bg-white !p-4 rounded-xl">
        <div className="flex justify-between gap-4 items-center mb-4">
          <div className="flex items-center gap-4">
            <p className="text-lg font-medium">All Organizations</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="UNCONFIRMED">Unconfirmed</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <ExportCSVButton
              onClick={handleExport}
              disabled={!filteredData?.length}
            />
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
              <PlusCircle /> Add Organization
            </Button>
          </div>
        </div>

        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
          <AgGridReact
            rowData={filteredData || []}
            columnDefs={columnDefs}
            defaultColDef={{
              flex: 1,
              minWidth: 120,
              filter: false,
              sortable: true,
              resizable: true,
              unSortIcon: true,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
            rowHeight={72}
            headerHeight={48}
            domLayout="autoHeight"
            animateRows={true}
            overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
          />
        </div>
        <div className="text-center flex flex-col gap-4 my-4 text-muted-foreground">
          {isOrgListLoading && <p>Loading...</p>}
          {!hasMore && !isOrgListLoading && <p>No more data to load.</p>}
          {filteredData?.length > 0 && hasMore && !isOrgListLoading && (
            <Button size="sm" onClick={() => handleFetchOrgListing()}>
              Load More
            </Button>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUserMutation.mutate({
              userId: userToDelete.id,
              email: userToDelete.email,
              userType: "organisation",
            });
            setIsDeleteDialogOpen(false);
          }
        }}
        isLoading={deleteUserMutation?.isPending}
        title="Delete Organisation"
        description={`Are you sure you want to delete ${userToDelete?.name || "this organisation"}? This action cannot be undone.`}
      />
    </>
  );
}

// ─── Brokers ──────────────────────────────────────────────────────────────────
function AdminBrokersList() {
  const [isBrokerListLoading, setIsBrokerListLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [brokers, setBrokers] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { deleteUserMutation } = useDeleteUser(() => {
    handleFetchBrokersWithSearchCount(true);
    setHasMore(true);
  });
  const { restoreUserMutation } = useRestoreUser(() => {
    handleFetchBrokersWithSearchCount(true);
    setHasMore(true);
  });

  useEffect(() => {
    handleFetchBrokersWithSearchCount();
  }, []);

  const handleFetchBrokersWithSearchCount = async (isRefetch) => {
    setIsBrokerListLoading(true);
    try {
      const response = await getBrokersWithSearchCount(
        isRefetch ? null : nextToken,
      );
      const { updatedBrokers, nextToken: newNextToken } = response;
      setBrokers((pre) => {
        const allData = isRefetch
          ? updatedBrokers
          : [...pre, ...updatedBrokers];
        return Array.from(new Map(allData.map((i) => [i.id, i])).values());
      });
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {}
    setIsBrokerListLoading(false);
  };

  const filteredData = useMemo(
    () =>
      brokers?.filter(
        (i) => statusFilter === "ALL" || i.status === statusFilter,
      ),
    [brokers, statusFilter],
  );

  const handleExport = useCallback(() => {
    exportToCSV(
      filteredData,
      ["Sr. No.", "Name", "Email", "Team Strength", "Status"],
      [
        (row, idx) => idx + 1,
        (row) => row.name,
        (row) => row.email,
        (row) => row.teamStrength || "-",
        (row) => row.status,
      ],
      `brokers-${statusFilter.toLowerCase()}-${todayStr()}.csv`,
    );
  }, [filteredData, statusFilter]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "index",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        filter: false,
        cellStyle: { fontWeight: "500", color: "black" },
        flex: 1,
        minWidth: 180,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email",
        field: "email",
        filter: false,
        flex: 1.5,
        minWidth: 220,
      },
      {
        headerName: "Team Strength",
        field: "teamStrength",
        filter: false,
        valueGetter: (params) => params.data.teamStrength || "-",
        minWidth: 140,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusRenderer,
        filter: false,
        flex: 1,
        minWidth: 160,
      },
      {
        headerName: "Action",
        field: "id",
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        flex: 0,
        filter: false,
        sortable: false,
        cellRenderer: (params) => {
          const item = params.data;
          return (
            <div className="flex items-center gap-2 h-full">
              <Button
                size="icon"
                variant="ghost"
                disabled={item?.status === "DELETED"}
                onClick={() => {
                  setSelectedBroker(item);
                  setIsOpen(true);
                }}
              >
                <PencilLine />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (item?.status === "DELETED") {
                    restoreUserMutation.mutate({
                      userId: item.id,
                      email: item.email,
                      userType: "broker",
                    });
                  } else {
                    setUserToDelete(item);
                    setIsDeleteDialogOpen(true);
                  }
                }}
              >
                {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
              </Button>
            </div>
          );
        },
      },
    ],
    [restoreUserMutation, deleteUserMutation],
  );

  return (
    <>
      {isOpen && (
        <AddAdminModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedBroker({});
          }}
          title="Broker"
          userType="broker"
          invalidateFun={() => {
            handleFetchBrokersWithSearchCount(true);
            setHasMore(true);
          }}
          selectedUser={selectedBroker}
        />
      )}
      <div className="bg-white !p-4 rounded-xl">
        <div className="flex justify-between gap-4 items-center mb-4 flex-wrap">
          <div className="flex items-center gap-4">
            <p className="text-lg font-medium">All Brokers</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="UNCONFIRMED">Unconfirmed</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <ExportCSVButton
              onClick={handleExport}
              disabled={!filteredData?.length}
            />
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
              <PlusCircle /> Add Broker
            </Button>
          </div>
        </div>

        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
          <AgGridReact
            rowData={filteredData || []}
            columnDefs={columnDefs}
            defaultColDef={{
              flex: 1,
              minWidth: 120,
              filter: false,
              sortable: true,
              resizable: true,
              unSortIcon: true,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
            rowHeight={72}
            headerHeight={48}
            domLayout="autoHeight"
            animateRows={true}
            overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
          />
        </div>
        <div className="text-center flex flex-col gap-4 my-4 text-muted-foreground">
          {isBrokerListLoading && <p>Loading...</p>}
          {!hasMore && <p>No more data to load.</p>}
          {filteredData?.length > 0 && hasMore && !isBrokerListLoading && (
            <Button
              size="sm"
              onClick={() => handleFetchBrokersWithSearchCount()}
            >
              Load More
            </Button>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUserMutation.mutate({
              userId: userToDelete.id,
              email: userToDelete.email,
              userType: "broker",
            });
            setIsDeleteDialogOpen(false);
          }
        }}
        isLoading={deleteUserMutation?.isPending}
        title="Delete Broker"
        description={`Are you sure you want to delete ${userToDelete?.name || "this broker"}? This action cannot be undone.`}
      />
    </>
  );
}

// ─── Agents ───────────────────────────────────────────────────────────────────
function Agents() {
  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isAgentListLoading, setIsAgentListLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isReinviteDialogOpen, setIsReinviteDialogOpen] = useState(false);
  const [userToReinvite, setUserToReinvite] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { deleteUserMutation } = useDeleteUser(() => {
    handleFetchAgentListing(true);
    setHasMore(true);
  });
  const { restoreUserMutation } = useRestoreUser(() => {
    handleFetchAgentListing(true);
    setHasMore(true);
  });
  const reinviteMutation = useMutation({
    mutationFn: (payload) => reinviteUser(payload),
    onSuccess: () => {
      toast.success("Reinvitation sent successfully");
      handleFetchAgentListing(true);
      setHasMore(true);
    },
  });

  const handleFetchAgentListing = async (isRefetch) => {
    setIsAgentListLoading(true);
    try {
      const response = await getAgentListings(isRefetch ? null : nextToken);
      const { items, nextToken: newNextToken } = response;
      setAgents((pre) => {
        const allData = isRefetch ? items : [...pre, ...items];
        return Array.from(new Map(allData.map((i) => [i.id, i])).values());
      });
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {}
    setIsAgentListLoading(false);
  };

  useEffect(() => {
    handleFetchAgentListing();
  }, []);

  const filteredData = useMemo(
    () =>
      agents?.filter(
        (i) => statusFilter === "ALL" || i.status === statusFilter,
      ),
    [agents, statusFilter],
  );

  const handleExport = useCallback(() => {
    exportToCSV(
      filteredData,
      ["Sr. No.", "Name", "Email", "Status"],
      [
        (row, idx) => idx + 1,
        (row) => row.name,
        (row) => row.email,
        (row) => row.status,
      ],
      `agents-${statusFilter.toLowerCase()}-${todayStr()}.csv`,
    );
  }, [filteredData, statusFilter]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "index",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        filter: false,
        cellStyle: { fontWeight: "500", color: "black" },
        flex: 1,
        minWidth: 180,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email",
        field: "email",
        filter: false,
        flex: 1.5,
        minWidth: 220,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusRenderer,
        filter: false,
        flex: 1,
        minWidth: 160,
      },
      {
        headerName: "Reinvite",
        field: "reinvite",
        filter: false,
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        flex: 0,
        sortable: false,
        cellRenderer: (params) => {
          const item = params.data;
          return (
            item?.status === "UNCONFIRMED" && (
              <div className="flex justify-center items-center h-full">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setUserToReinvite(item);
                    setIsReinviteDialogOpen(true);
                  }}
                  disabled={reinviteMutation.isPending}
                >
                  <UserPlus />
                </Button>
              </div>
            )
          );
        },
      },
      {
        headerName: "Action",
        field: "id",
        filter: false,
        sortable: false,
        width: 150,
        minWidth: 150,
        flex: 0,
        cellRenderer: (params) => {
          const item = params.data;
          return (
            <div className="flex items-center gap-2 h-full">
              <Button
                size="icon"
                variant="ghost"
                disabled={item?.status === "DELETED"}
                onClick={() => {
                  setSelectedUser(item);
                  setIsOpen(true);
                }}
              >
                <PencilLine />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (item?.status === "DELETED") {
                    restoreUserMutation.mutate({
                      userId: item.id,
                      email: item.email,
                      userType: "agent",
                    });
                  } else {
                    setUserToDelete(item);
                    setIsDeleteDialogOpen(true);
                  }
                }}
              >
                {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
              </Button>
            </div>
          );
        },
      },
    ],
    [reinviteMutation, restoreUserMutation, deleteUserMutation],
  );

  return (
    <>
      {isOpen && (
        <AddAdminModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedUser({});
          }}
          title="Agent"
          userType="agent"
          invalidateFun={() => {
            handleFetchAgentListing(true);
            setHasMore(true);
          }}
          selectedUser={selectedUser}
        />
      )}
      <div className="bg-white !p-4 rounded-xl">
        <div className="flex justify-between gap-4 items-center mb-4 flex-wrap">
          <div className="flex items-center gap-4">
            <p className="text-lg font-medium">All Agents</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="UNCONFIRMED">Unconfirmed</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <ExportCSVButton
              onClick={handleExport}
              disabled={!filteredData?.length}
            />
            <Button variant="secondary" onClick={() => setIsOpen(true)}>
              <PlusCircle /> Add Agent
            </Button>
          </div>
        </div>

        <div
          className="ag-theme-quartz custom-ag-grid"
          style={{ width: "100%" }}
        >
          <AgGridReact
            rowData={filteredData || []}
            columnDefs={columnDefs}
            defaultColDef={{
              flex: 1,
              minWidth: 120,
              filter: false,
              sortable: true,
              resizable: true,
              unSortIcon: true,
              wrapHeaderText: true,
              autoHeaderHeight: true,
            }}
            rowHeight={72}
            headerHeight={48}
            domLayout="autoHeight"
            animateRows={true}
            overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
          />
        </div>
        <div className="text-center flex flex-col gap-4 my-4 text-muted-foreground">
          {isAgentListLoading && <p>Loading...</p>}
          {!hasMore && !isAgentListLoading && <p>No more data to load.</p>}
          {filteredData?.length > 0 && hasMore && !isAgentListLoading && (
            <Button size="sm" onClick={() => handleFetchAgentListing()}>
              Load More
            </Button>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUserMutation.mutate({
              userId: userToDelete.id,
              email: userToDelete.email,
              userType: "agent",
            });
            setIsDeleteDialogOpen(false);
          }
        }}
        isLoading={deleteUserMutation?.isPending}
        title="Delete Agent"
        description={`Are you sure you want to delete ${userToDelete?.name || "this agent"}? This action cannot be undone.`}
      />

      <ConfirmDeleteModal
        open={isReinviteDialogOpen}
        onClose={() => setIsReinviteDialogOpen(false)}
        onConfirm={() => {
          if (userToReinvite) {
            reinviteMutation.mutate(
              { email: userToReinvite.email },
              { onSettled: () => setIsReinviteDialogOpen(false) },
            );
          }
        }}
        isLoading={reinviteMutation?.isPending}
        title="Reinvite Agent"
        description={`Are you sure you want to send a reinvitation email to ${userToReinvite?.name || userToReinvite?.agentName || "this agent"}?`}
        confirmText="Reinvite"
        loadingText="Sending..."
      />
    </>
  );
}
