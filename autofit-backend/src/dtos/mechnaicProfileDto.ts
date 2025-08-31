export interface MechanicProfileDto {
    id?: string;
    mechanicId: string;
    availability: 'avilable' | 'notAvailable' | 'busy';
    registration: {
        status: 'pending' | 'approved' | 'rejected';
        rejectionReason?: string;
        approvedOn?: Date;
        rejectedOn?: Date;
    };
    education: string;
    specialised: string;
    experience: number;
    shopName: string;
    place: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    landmark: string;
    photo: string;
    shopImage: string;
    qualification: string;
}