import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import themeSlice from "./slices/themeSlice";
import languageSlice from "./slices/languageSlice";
import compactSlice from "./slices/compactSlice";
import collapsedSlice from "./slices/collapsedSlice";
import cartSlice from "./slices/cartSlice";
import menuSlice from "./slices/menuSlice";

import pluginsScriptSlice from "./slices/Data/pluginsScriptSlice";
import pagesSlice from "./slices/Data/pagesSlice";
import usersSlice from "./slices/Data/usersSlice";
import groupPageSlice from "./slices/Data/groupPageSlice";
import fileMangerSlice from "./slices/filesSlice";
import roleSlice from "./slices/Data/roleSlice";
import coursesSlice from "./slices/Data/coursesSlice";
import categoryCoursesSlice from "./slices/Data/categoryCourseSlice";
import coursesOutstandSlice from "./slices/Data/coursesOutstandSlice"
import orderSlice from "./slices/Data/orderSlice";
import revenueSlice from "./slices/Data/revenueSlice";
import pluginsSlice from "./slices/Data/pluginsSlice";

import orderUser from "./slices/User/orderSlice";
import courseUser from "./slices/User/courseSlice";

const saveToLocalStorage = (state) => {
  try {
    const themeState = {
      theme: state.theme,
      language: state.language,
      compact: state.compact,
      collapsed: state.collapsed,
    };

    const serializedState = JSON.stringify(themeState);
    localStorage.setItem('Aris', serializedState);
  } catch (e) {
    console.error(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('Aris');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const persistedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    language: languageSlice,
    compact: compactSlice,
    collapsed: collapsedSlice,
    cart: cartSlice,
    menu: menuSlice,

    pluginsScript: pluginsScriptSlice,
    pages: pagesSlice,
    users: usersSlice,
    groupPages: groupPageSlice,
    fileMangers: fileMangerSlice,
    roles: roleSlice,
    courses: coursesSlice,
    categoryCourses: categoryCoursesSlice,
    outstand: coursesOutstandSlice,
    order: orderSlice,
    revenue: revenueSlice,
    plugins: pluginsSlice,

    courseUser: courseUser,
    orderUser: orderUser,
  },
  preloadedState: persistedState,
});

store.subscribe(() => saveToLocalStorage(store.getState()));