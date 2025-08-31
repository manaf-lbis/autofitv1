import React from "react";
import InfiniteScrollTable from "../../components/InfiniteScrollTable"; 
import { useGetAllUsersQuery, useUpdateUserStatusMutation} from  "../../../../services/adminServices/userManagement"

const mapToEntity = (data: any[]) => data.map(user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.mobile || "N/A",
  status: user.status,
}));

const UserDashboard: React.FC = () => (
  <InfiniteScrollTable
    entityName="User"
    useGetAllQuery={useGetAllUsersQuery}
    useUpdateStatusMutation={useUpdateUserStatusMutation}
    detailPathPrefix="/admin/user-details"
    breadcrumbs={[{ page: "User", href: "/users" }, { page: "User Management", href: "/users" }]}
    mapToEntity={mapToEntity}
    responseDataKey="users"
  />
);

export default UserDashboard