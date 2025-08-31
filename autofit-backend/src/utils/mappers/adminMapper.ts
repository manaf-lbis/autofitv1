import { AdminDocument } from "../../models/adminModel";
import { AdminDto } from "../../dtos/adminDto";

export class AdminMapper {

    static adminDto(admin: AdminDocument): AdminDto {
        return {
            _id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            mobile: admin.mobile,
            role: admin.role,
        };
    }





}