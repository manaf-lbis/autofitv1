import React, { useEffect, useState } from "react";
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Eye, 
  Ban, 
  CheckCircle,
  Search,
  Circle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../slices/adminSlice";

type Status = "active" | "inactive" | "blocked";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: Status;
}

interface StatusStyle {
  color: string;
  label: string;
}

const userData: User[] = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "+1 (555) 123-4567", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", phone: "+1 (555) 987-6543", status: "blocked" },
  { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com", phone: "+1 (555) 456-7890", status: "active" },
  { id: 4, name: "Sarah Wilson", email: "sarah.wilson@example.com", phone: "+1 (555) 321-0987", status: "inactive" },
  { id: 5, name: "David Brown", email: "david.brown@example.com", phone: "+1 (555) 654-3210", status: "active" },
  { id: 6, name: "Emily Davis", email: "emily.davis@example.com", phone: "+1 (555) 789-0123", status: "blocked" },
  { id: 7, name: "Robert Miller", email: "robert.miller@example.com", phone: "+1 (555) 234-5678", status: "active" },
  { id: 8, name: "Lisa Anderson", email: "lisa.anderson@example.com", phone: "+1 (555) 876-5432", status: "inactive" },
  { id: 9, name: "Chris Evans", email: "chris.evans@example.com", phone: "+1 (555) 111-2222", status: "active" },
  { id: 10, name: "Anna Taylor", email: "anna.taylor@example.com", phone: "+1 (555) 333-4444", status: "inactive" },
  { id: 11, name: "Mark Lee", email: "mark.lee@example.com", phone: "+1 (555) 555-6666", status: "blocked" },
  { id: 12, name: "Sophie Clark", email: "sophie.clark@example.com", phone: "+1 (555) 777-8888", status: "active" },
];

const UserDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(setBreadcrumbs([{page:'User', href:'/users'},{page:'User Management', href:'/users'}]))
  },[])

  // Filter users based on search term
  const filteredData: User[] = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  const toggleDropdown = (userId: number) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const getStatusIcon = (status: Status) => {
    const statusStyles: Record<Status, StatusStyle> = {
      active: { color: "text-green-500", label: "Active" },
      inactive: { color: "text-yellow-500", label: "Inactive" },
      blocked: { color: "text-red-500", label: "Blocked" },
    };

    const { color, label } = statusStyles[status];
    return (
      <div className="flex items-center gap-2">
        <Circle className={`h-3 w-3 ${color} fill-current`} />
        <span className="text-xs sm:text-sm text-gray-700 capitalize">{label}</span>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 bg-gray-100 min-h-screen font-sans rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">User Management</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage and monitor user accounts</p>
        </div>
        <div className="relative w-full sm:w-80">
             <Search className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none transition-all placeholder-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-150px)] sm:h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 hide-scrollbar">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[150px] sm:min-w-[200px]">
                  <button className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[200px] sm:min-w-[250px]">
                  <button className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    Email
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[150px] sm:min-w-[180px]">
                  <button className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    Phone
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[120px] sm:min-w-[150px]">
                  <button className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left w-16 sm:w-20">
                  <span className="font-medium text-gray-700 text-xs sm:text-sm">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 sm:px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-10 sm:h-12 w-10 sm:w-12 text-gray-300" />
                      <div>
                        <p className="text-base sm:text-lg font-medium">No users found</p>
                        <p className="text-xs sm:text-sm mt-1">Try adjusting your search terms</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[150px] sm:min-w-[200px]">
                      <span className="text-gray-800 font-medium text-xs sm:text-sm">{user.name}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[200px] sm:min-w-[250px] text-gray-600 text-xs sm:text-sm">{user.email}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[150px] sm:min-w-[180px] text-gray-600 font-mono text-xs sm:text-sm">{user.phone}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[120px] sm:min-w-[150px]">{getStatusIcon(user.status)}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 w-16 sm:w-20 relative">
                      <button
                        onClick={() => toggleDropdown(user.id)}
                        className="h-7 sm:h-8 w-7 sm:w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Open menu"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                      {openDropdown === user.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdown(null)}
                          />
                          <div className="absolute right-2 sm:right-4 top-8 sm:top-10 z-20 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                            <button className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            {user.status === "blocked" ? (
                              <button className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                Unblock User
                              </button>
                            ) : (
                              <button className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                                <Ban className="h-4 w-4" />
                                Block User
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        {filteredData.length > 0 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-600 gap-2">
              <p>Total {filteredData.length} users</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-100">
                  {filteredData.filter((u) => u.status === "active").length} Active
                </span>
                <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-100">
                  {filteredData.filter((u) => u.status === "blocked").length} Blocked
                </span>
                <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-100">
                  {filteredData.filter((u) => u.status === "inactive").length} Inactive
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;