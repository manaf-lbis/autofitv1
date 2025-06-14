import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    availability: 'available' | 'notAvailable' | 'busy'
}

const initialState: InitialState = {
    availability: 'available'
}


const mechanicSlice = createSlice({
    name: 'mechanicSlice',
    initialState: initialState,

    reducers: {

        setAvailability(state, action: PayloadAction<'available' | 'notAvailable' | 'busy'>) {
            state.availability = action.payload;
        },


    }
})

export const { setAvailability } = mechanicSlice.actions;

export default mechanicSlice.reducer