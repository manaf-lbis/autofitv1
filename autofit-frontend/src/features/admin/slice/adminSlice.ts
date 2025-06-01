import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BreadCrumbItem {
  page: string;
  href: string;
}

interface InitialState {
  breadcrumbs: BreadCrumbItem[];
}

const initialState: InitialState = {
  breadcrumbs: [{ page: "Dashboard", href: "/dashboard" }],
};

const adminSlice = createSlice({
  name: "adminState",
  initialState,
  reducers: {

    setBreadcrumbs(state, action: PayloadAction<BreadCrumbItem[]>) {
      state.breadcrumbs = action.payload;
    },

    addBreadcrumb(state, action: PayloadAction<BreadCrumbItem[]>) {
      state.breadcrumbs = action.payload;
    },

  },
});

export const { setBreadcrumbs, addBreadcrumb } = adminSlice.actions;
export default adminSlice.reducer;