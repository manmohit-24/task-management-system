import { createSlice } from "@reduxjs/toolkit";
import getThemeColors from "../../Themes/ThemeColors";

const GeneralSlice = createSlice({
    name: "GeneralData",
    initialState: {
        Theme: "Light",
        ThemeColors: getThemeColors(),
        showConfirmDelete: {
            show: false,
            title: null,
            target: null,
            targetId : null,
        },
    },
    reducers: {
        setTheme: (state, action) => {
            state.Theme = action.payload;
        },

        setConfirmDelete: (state, action) => {
            state.showConfirmDelete = action.payload;
        },
        clearConfirmDelete: (state) => {
            state.showConfirmDelete = {
                show: false,
                title: null,
                target: null,
                targetId: null,
            };
        },
    },
});

export const { setTheme, setConfirmDelete, clearConfirmDelete } = GeneralSlice.actions;
export default GeneralSlice.reducer;
