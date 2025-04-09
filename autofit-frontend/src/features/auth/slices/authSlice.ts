import { createSlice ,PayloadAction} from "@reduxjs/toolkit";


interface User {
    id : string;
    email : string;
    name : string;
    role : 'user' | 'admin' | 'mechanic'
}

interface AuthState {
    user : User | null,
    isLoggedIn : boolean;
    error : string | null
}

const initalState : AuthState = {
    user : null,
    isLoggedIn : false,
    error :null,
}

const authSlice = createSlice({
    name : 'auth',
    initialState : initalState,
    reducers:{
        authSuccess : (state :AuthState , action :PayloadAction<User>)=>{
            initalState.user = action.payload,
            initalState.isLoggedIn = true
        },
        logout :(state :AuthState)=>{
            initalState.isLoggedIn = false;
            initalState.error = null;
            initalState.user = null  
        }
    }
}) 


export const {authSuccess,logout} = authSlice.actions
export default authSlice.reducer
