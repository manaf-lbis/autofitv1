import React, { useEffect, useState, useRef, useCallback } from "react";
import { MoreHorizontal, ArrowUpDown, Eye, Ban, CheckCircle, Search, Circle } from "lucide-react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../slices/adminSlice"; 
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

type Status = "active" | "inactive" | "blocked";

interface BaseEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: Status;
}

interface StatusStyle {
  color: string;
  label: string;
}

const UserTableShimmer: React.FC = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
        <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
        <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
        <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="flex items-center gap-2"><div className="h-3 w-3 bg-gray-200 rounded-full"></div><div className="h-4 bg-gray-200 rounded w-16"></div></div></td>
        <td className="px-4 sm:px-6 py-3 sm:py-4"><div className="h-7 w-7 bg-gray-200 rounded-full mx-auto"></div></td>
      </tr>
    ))}
  </>
);

interface InfiniteScrollTableProps<Entity extends BaseEntity> {
  entityName: string;
  useGetAllQuery: any;
  useUpdateStatusMutation: any;
  detailPathPrefix: string;
  breadcrumbs: { page: string; href: string }[];
  mapToEntity: (data: any[]) => Entity[];
  responseDataKey?: string;
}

const InfiniteScrollTable = <Entity extends BaseEntity>({
  entityName,
  useGetAllQuery,
  useUpdateStatusMutation,
  detailPathPrefix,
  breadcrumbs,
  mapToEntity,
  responseDataKey = 'users',
}: InfiniteScrollTableProps<Entity>) => {
  const uiPlural = `${entityName.toLowerCase()}s`;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [allEntities, setAllEntities] = useState<Entity[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const limit = 10;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateStatusMutation();

  useEffect(() => {
    dispatch(setBreadcrumbs(breadcrumbs));
  }, [dispatch, breadcrumbs]);

  const { data: response, isFetching } = useGetAllQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    sortField,
    sortOrder,
  });

  useEffect(() => {
    if (response?.data[responseDataKey]) {
      const newEntities = mapToEntity(response.data[responseDataKey]);
      setAllEntities((prev) => {
        const existingIds = new Set(prev.map((e) => e.id));
        const filteredNew = newEntities.filter((e) => !existingIds.has(e.id));
        return [...prev, ...filteredNew];
      });
      setHasMore(response.data.page < response.data.totalPages);
      if (newEntities.length === 0) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  }, [response, mapToEntity, responseDataKey]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, isFetching]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setAllEntities([]);
    setErrorMessage(null);
  }, []);

  const handleSort = useCallback((field: string) => {
    setSortField(field);
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setPage(1);
    setAllEntities([]);
    setErrorMessage(null);
  }, [sortField, sortOrder]);

  const toggleDropdown = useCallback((entityId: string) => {
    setOpenDropdown(openDropdown === entityId ? null : entityId);
  }, [openDropdown]);

  const handleStatusUpdate = useCallback(async (entityId: string, newStatus: 'active' | 'blocked') => {
    try {
      await updateStatus({ id: entityId, status: newStatus }).unwrap();
      setAllEntities((prev) =>
        prev.map((entity) =>
          entity.id === entityId ? { ...entity, status: newStatus } : entity
        )
      );
      setOpenDropdown(null);
    } catch (error: any) {
      setErrorMessage(`Failed to ${newStatus === 'blocked' ? 'block' : 'unblock'} ${entityName.toLowerCase()}: ${error?.data?.message || 'Unknown error'}`);
    }
  }, [updateStatus, entityName]);

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

  const renderEntityRow = (entity: Entity) => (
    <tr key={entity.id} className="hover:bg-gray-50 transition-all duration-200">
      <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[150px] sm:min-w-[200px]">
        <span className="text-gray-800 font-medium text-xs sm:text-sm">{entity.name}</span>
      </td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[200px] sm:min-w-[250px] text-gray-600 text-xs sm:text-sm">{entity.email}</td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[150px] sm:min-w-[180px] text-gray-600 font-mono text-xs sm:text-sm">{entity.phone}</td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[120px] sm:min-w-[150px]">{getStatusIcon(entity.status)}</td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 w-16 sm:w-20 relative">
        <button
          onClick={() => toggleDropdown(entity.id)}
          className="h-7 sm:h-8 w-7 sm:w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
          disabled={isUpdatingStatus}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
        {openDropdown === entity.id && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
            <div className="absolute right-2 sm:right-4 top-8 sm:top-10 z-20 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
              <button
                onClick={() => navigate(`${detailPathPrefix}/${entity.id}`)}
                className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                disabled={isUpdatingStatus}
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
              {entity.status === "blocked" ? (
                <button
                  onClick={() => handleStatusUpdate(entity.id, 'active')}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                  disabled={isUpdatingStatus}
                >
                  <CheckCircle className="h-4 w-4" />
                  Unblock {entityName}
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate(entity.id, 'blocked')}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  disabled={isUpdatingStatus}
                >
                  <Ban className="h-4 w-4" />
                  Block {entityName}
                </button>
              )}
            </div>
          </>
        )}
      </td>
    </tr>
  );

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 bg-gray-100 min-h-screen font-sans rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{entityName} Management</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage and monitor {uiPlural} accounts</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={`Search ${uiPlural}...`}
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none transition-all placeholder-gray-400 text-sm"
          />
        </div>
      </div>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
          <button className="absolute top-0 right-0 px-4 py-3" onClick={() => setErrorMessage(null)}>
            <span className="text-red-700">×</span>
          </button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-150px)] sm:h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0 hide-scrollbar">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[150px] sm:min-w-[200px]">
                  <button onClick={() => handleSort("name")} className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[200px] sm:min-w-[250px]">
                  <button onClick={() => handleSort("email")} className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    Email
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[150px] sm:min-w-[180px]">
                  <button onClick={() => handleSort("mobile")} className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    Phone
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[120px] sm:min-w-[150px]">
                  <button onClick={() => handleSort("status")} className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
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
              {allEntities.length === 0 && isFetching ? (
                <UserTableShimmer />
              ) : allEntities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 sm:px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-10 sm:h-12 w-10 sm:w-12 text-gray-300" />
                      <div>
                        <p className="text-base sm:text-lg font-medium">No {uiPlural} found</p>
                        <p className="text-xs sm:text-sm mt-1">Try adjusting your search terms</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {allEntities.map(renderEntityRow)}
                  {isFetching && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
              <tr><td colSpan={5}><div ref={loadMoreRef} className="h-10" /></td></tr>
            </tbody>
          </table>
        </div>
        {allEntities.length > 0 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-600 gap-2">
              <p>Total {response?.data.total || 0} {uiPlural}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-100">
                  {allEntities.filter((u) => u.status === "active").length} Active
                </span>
                <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-100">
                  {allEntities.filter((u) => u.status === "blocked").length} Blocked
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScrollTable;