export interface MechanicDto {
    id?: string;
    name: string;
    email: string;
    mobile?: string;
    role: string;
    status: 'active' | 'blocked';
}

export interface MechanicDtoWithAvatar extends MechanicDto {
    avatar: string;
}