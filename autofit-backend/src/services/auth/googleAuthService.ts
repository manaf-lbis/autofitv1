import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../../utils/apiError";
import { TokenService } from "../token/tokenService";


const authClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET)

export class GoogleAuthService {

    constructor(
       private userRepository : IUserRepository,
       private tokenService : TokenService
    ){ }

    async googleAuth ({code, role}:{code:string,role: 'user' |'mechanic'}){

        const {tokens} = await authClient.getToken({code,redirect_uri :process.env.GOOGLE_REDIRECT_URI})

        authClient.setCredentials(tokens)

        const ticket = await authClient.verifyIdToken({
            idToken : tokens.id_token as string,
            audience:process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            throw new ApiError('Invalid Google Token')
        }

        const allowedRoles = ['user']; //! 'mechanic'
        if (!allowedRoles.includes(role)) {
            throw new ApiError('Suspicious Activity Detected', 403);
        }

        const {sub,email,name} = payload;

        let user;

        if(true || role === 'user'){ //! remove true after mech implimentation 
            user = await this.userRepository.findByEmail(email);

            if(!user){
               user = await this.userRepository.create({email,role,googleId:sub, name :name || 'user'})
            }
  
            if(user.googleId !== sub){
                throw new ApiError('Invalid Google ID')
            }


        }else if(role === 'mechanic'){
            //! mech impli
        }

        const token = this.tokenService.generateToken({
            id: user._id,
            role: user.role,
        });

        return {token,user:{name: user.name,role: user.role,}}
    }
}



