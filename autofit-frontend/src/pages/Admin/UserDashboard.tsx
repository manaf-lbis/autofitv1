import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"

export function UserDashboard() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/user/allusers", {
        credentials: "include",
      });

      const result = await res.json();

      // ✅ Access data from result.data
      if (result.status === "success" && Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        console.error("Unexpected API response:", result);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Table>
      <TableCaption>Users List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">User Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: any) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone || "—"}</TableCell>
            <TableCell>{user.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Users</TableCell>
          <TableCell className="text-right">{users.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
