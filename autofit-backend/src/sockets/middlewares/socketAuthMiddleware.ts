import { Socket } from "socket.io";
import { ApiError } from "../../utils/apiError";
import { UserModel } from "../../models/userModel";
import { MechanicModel } from "../../models/mechanicModel";
import { verifyJwt } from "../verifyJwt";
import { HttpStatus } from "../../types/responseCode";
import { Role } from "../../types/role";

export interface User {
  id: string;
  role: string;
  name: string
}

export const socketAuthMiddleware = async (socket: Socket): Promise<User> => {
  try {
    
    const user = verifyJwt(socket)
    let name: string;

    if (user.role === Role.USER) {

      const userDoc = await UserModel.findById(user.id).select('name')
      if (!userDoc) throw new ApiError("User not found", HttpStatus.NOT_FOUND);
      name = userDoc.name

    } else if (user.role === Role.MECHANIC) {

      const mechanic = await MechanicModel.findById(user.id).select("name");
      if (!mechanic) throw new ApiError("Mechanic not found", HttpStatus.NOT_FOUND);
      name = mechanic.name;

    } else {
      throw new ApiError("Invalid role", HttpStatus.UNAUTHORIZED);
    }

    return {...user,name}

  } catch {
    throw new ApiError("Invalid or expired token", HttpStatus.UNAUTHORIZED);
  }
  
};
