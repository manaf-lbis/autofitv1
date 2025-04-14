import React from "react";
import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";
import ProfileCard from "../components/ProfileCard";
import AddressCard from "../components/AddressCard";
import { House } from "lucide-react";
import VehicleCard from "../components/VehicleCard";

const ProfilePage: React.FC = () => {
  const { data: userData } = useGetCurrentUserQuery();

  return (
    <>
      {userData?.status === "success" && (
        <div>
          <div className="flex flex-col lg:flex-row gap-4">
            <ProfileCard />
            <AddressCard />
          </div>
          
          <div>
            <VehicleCard />
          </div>
        </div>
      
      )}
    </>
  );
};

export default ProfilePage;