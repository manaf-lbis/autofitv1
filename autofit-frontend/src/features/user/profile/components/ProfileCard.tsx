import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareUser, Mail, Phone, Clock } from "lucide-react";

const ProfileCard = () => {
  const userData = {
    username: "user_name",
    email: "user@gmail.com",
    phone: "9179941411",
    lastActive: "May 20, 2025",
  };

  return (
    <Card className="w-full lg:w-6/12 bg-white shadow-sm rounded-lg border border-gray-100">
      <CardHeader className="bg-gray-50 p-4 sm:p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <SquareUser className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle className="text-xl font-medium text-gray-800">My Profile</CardTitle>
          </div>
          <Button
            variant="ghost"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            onClick={() => alert("Edit profile clicked!")}
          >
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <SquareUser className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Username</span>
          </div>
          <span className="text-gray-600">{userData.username}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Email</span>
          </div>
          <span className="text-gray-600">{userData.email}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Phone</span>
          </div>
          <span className="text-gray-600">{userData.phone}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">Last Active</span>
          </div>
          <span className="text-gray-600">{userData.lastActive}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;