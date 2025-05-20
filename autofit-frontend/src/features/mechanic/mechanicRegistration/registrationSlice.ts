import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  formData: {
    name: string;
    email: string;
    mobile: string;
    education: string;
    specialised: string;
    experience: number;
    shopName: string;
    place: string;
    location: string;
    landmark: string;
  } | null;

  currentStep: number;
  isLoading : boolean
}

const initialState: RegistrationState = {
  formData: null,
  currentStep: 0,
  isLoading : false
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    updateFormData(state, action: PayloadAction<Partial<RegistrationState["formData"]>>) {
      if (!state.formData) {
        state.formData = { ...action.payload } as RegistrationState["formData"];
      } else {
        state.formData = {
          ...state.formData,
          ...action.payload,
        };
      }
    },

    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },

    nextStep(state) {
      state.currentStep += 1;
    },

    prevStep(state) {
      state.currentStep = Math.max(0, state.currentStep - 1);
    },

    resetRegistration(state) {
      state.formData = null;
      state.currentStep = 0;
    },

    setLoading(state){
      state.isLoading = true
    },

    stopLoading(state){
      state.isLoading = false
    }


  },
});

export const {
  updateFormData,
  setCurrentStep,
  nextStep,
  prevStep,
  resetRegistration,
  setLoading,
  stopLoading
} = registrationSlice.actions;

export default registrationSlice.reducer;