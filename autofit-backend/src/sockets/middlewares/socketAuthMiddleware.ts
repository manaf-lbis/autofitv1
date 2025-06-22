import { Socket } from "socket.io";
import { ApiError } from "../../utils/apiError";
import { UserModel } from "../../models/userModel";
import { MechanicModel } from "../../models/mechanicModel";
import { verifyJwt } from "../verifyJwt";

export interface User {
  id: string;
  role: string;
  name: string
}

export const socketAuthMiddleware = async (socket: Socket): Promise<User> => {
  try {
    
    const user = verifyJwt(socket)
    let name: string;

    if (user.role === 'user') {

      const userDoc = await UserModel.findById(user.id).select('name')
      if (!userDoc) throw new ApiError("User not found", 404);
      name = userDoc.name

    } else if (user.role === "mechanic") {

      const mechanic = await MechanicModel.findById(user.id).select("name");
      if (!mechanic) throw new ApiError("Mechanic not found", 404);
      name = mechanic.name;

    } else {
      throw new ApiError("Invalid role", 403);
    }

    return {...user,name}

  } catch (err) {
    throw new ApiError("Invalid or expired token", 401);
  }
  
};
