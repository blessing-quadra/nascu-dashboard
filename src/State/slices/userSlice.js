import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    userInfo: { firstName: "", lastName: "" },
  },
  reducers: {
    updateUserInfo: (state, action)=> {
      state.userInfo = action.payload;
    }
  },
});

export const actions = userSlice.actions;
export default userSlice.reducer;
