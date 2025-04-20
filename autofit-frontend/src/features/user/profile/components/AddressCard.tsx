import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full lg:w-6/12 bg-white shadow-sm rounded-lg border border-gray-100">
      <CardHeader className="bg-gray-50 p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Home className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle className="text-xl font-medium text-gray-800">Address</CardTitle>
          </div>
          <Button
            variant="outline"
            className="bg-transparent text-blue-500 border-blue-500 hover:bg-blue-50"
            onClick={() => alert("Add new address clicked!")}
          >
            Add new Address
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ScrollArea className="h-48 rounded-md">
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No addresses added yet.</p>
          ) : (
            <div className="space-y-3 pr-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{address.address}</p>
                    </div>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                        onClick={() => alert(`Edit address ${address.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
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