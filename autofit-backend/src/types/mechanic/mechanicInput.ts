export interface CreateMechanicInput {
    name: string;
    email: string;
    password?: string;
    mobile?: string;
    role: 'user' | 'admin' | 'mechanic';
    googleId?:string
}