import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Home, Edit, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AddressCard = () => {
  const addresses = [
    { id: 1, address: "Address lin, one, place, district, state pin 12345" },
    { id: 2, address: "Address lin, two, city, region, state pin 67890" },
    { id: 3, address: "Address lin, two, city, region, state pin 67890" },
    { id: 4, address: "Address lin, two, city, region, state pin 67890" },
    { id: 5, address: "Address lin, two, city, region, state pin 67890" },
  ];

  return (
    <Card className="w-full lg:w-6/12 bg-white shadow-sm rounded-lg border border-gray-200">
      <CardHeader className="bg-gray-100 p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-gray-800">
            <Home className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-2xl font-semibold">Address</CardTitle>
          </div>
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0"
            onClick={() => alert("Add new address clicked!")}
          >
            Add new Address
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <ScrollArea className="h-48 rounded-md border border-gray-200">
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No addresses added yet.</p>
          ) : (
            <div className="space-y-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                      <p className="text-gray-700 text-sm">{address.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => alert(`Edit address ${address.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => alert(`Delete address ${address.id}`)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AddressCard;