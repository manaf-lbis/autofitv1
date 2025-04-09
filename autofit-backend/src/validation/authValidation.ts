import z from 'zod'

export const signupValidation = z.object({
    name: z.string().min(3, 'Name Requires'),
    email: z.string().email('Invalid Email'),
    password: z.string().min(6, 'Password must be 6+ characters'),
    mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
    role: z.enum(['user', 'admin', 'mechanic']).optional().default('user'),
});

export const loginValidation = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password is required'),
});