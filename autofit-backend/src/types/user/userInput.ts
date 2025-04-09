export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: 'user' | 'admin' | 'mechanic';
}