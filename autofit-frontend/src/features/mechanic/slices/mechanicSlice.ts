import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmergencyRequest } from "../components/dashboard/EmergencyTab";

interface InitialState {
    availability: 'available' | 'notAvailable' | 'busy',
    emergencyRequest : EmergencyRequest | null
}

const initialState: InitialState = {
    availability: 'available',
    emergencyRequest : null

}


const mechanicSlice = createSlice({
    name: 'mechanicSlice',
    initialState: initialState,

    reducers: {

        setAvailability(state, action: PayloadAction<'available' | 'notAvailable' | 'busy'>) {
            state.availability = action.payload;
        },

        setEmergencyRequest(state ,action){
            state.emergencyRequest = action.payload
        }


    }
})

export const { setAvailability,setEmergencyRequest } = mechanicSlice.actions;

export default mechanicSlice.reducer