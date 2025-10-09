import { createContext } from "react";
import { initSocket } from "@/lib/socket";

export const SocketContext = createContext<ReturnType<typeof initSocket> | null>(null);
