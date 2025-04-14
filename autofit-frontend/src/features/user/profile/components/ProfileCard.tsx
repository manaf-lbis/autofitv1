
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SquareUser, Mail, Phone, Clock } from "lucide-react";

const ProfileCard = () => {
  const userData = {
    username: "user_name",
    email: "user@gmail.com",
    phone: "9179941411",
    lastActive: "May 20, 2025",
  };

  return (
    <Card className="w-full lg:w-6/12 bg-white shadow-md rounded-lg border border-gray-200">
      <CardHeader className="bg-gray-100 p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-gray-800">
            <SquareUser className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-2xl font-semibold">My Profile</CardTitle>
          </div>
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0"
            onClick={() => alert("Edit profile clicked!")}
          >
            Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="flex justify-between items-center gap-3 text-gray-700">
          <div className="flex items-center gap-3">
            <SquareUser className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold">Username</span>
          </div>
          <span className="text-gray-600">{userData.username}</span>
        </div>
        <div className="flex justify-between items-center gap-3 text-gray-700">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold">Email</span>
          </div>
          <span className="text-gray-600">{userData.email}</span>
        </div>
        <div className="flex justify-between items-center gap-3 text-gray-700">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold">Phone</span>
          </div>
          <span className="text-gray-600">{userData.phone}</span>
        </div>
        <div className="flex justify-between items-center gap-3 text-gray-700">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold">Last Active</span>
          </div>
          <span className="text-gray-600">{userData.lastActive}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;