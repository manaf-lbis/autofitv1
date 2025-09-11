import { UserDocument } from "../models/userModel";


export interface UserBasicInfoDTO {
    name: string;
    email: string;
    mobile: string;
}

export interface UserWithIdDTO extends UserBasicInfoDTO {
    id: string
}

export interface UserResponseDTO extends UserBasicInfoDTO {
    id: string;
    role: string;
}

export interface AdminUserResponseDTO extends UserResponseDTO {
    status: string;
}

export class UserMapper {

    static toUserDetailsWithId(user: UserDocument): UserWithIdDTO {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        };
    }
    static toUserBasicInfo(user: UserDocument): UserBasicInfoDTO {
        return {
            name: user?.name,
            email: user?.email,
            mobile: user?.mobile,
        };
    };

    static toUserMap(user: UserDocument): UserResponseDTO {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role
        };

    };

    static toAdminResponse(user: UserDocument): AdminUserResponseDTO {
        return {
            id: user._id.toString(),
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            role: user.role,
            status: user.status,
        };
    };




}