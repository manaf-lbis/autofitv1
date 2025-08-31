import React from "react";
import InfiniteScrollTable from "../../components/InfiniteScrollTable";
import { useGetAllMechanicQuery, useUpdateMechanicStatusMutation } from "../../../../services/adminServices/mechanicManagement";

const mapToEntity = (data: any[]) => data.map(user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.mobile || "N/A",
  status: user.status,
}));

const MechanicDashboard: React.FC = () => (
  <InfiniteScrollTable
    entityName="Mechanic"
    useGetAllQuery={useGetAllMechanicQuery}
    useUpdateStatusMutation={useUpdateMechanicStatusMutation}
    detailPathPrefix="/admin/mechanic-details"
    breadcrumbs={[{ page: "Mechanic", href: "/mechanics" }, { page: "Mechanic Management", href: "/mechanics" }]}
    mapToEntity={mapToEntity}
    responseDataKey="users"
  />
);


export default MechanicDashboard;