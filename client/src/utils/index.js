/* eslint-disable no-undef */
export const id_layout = '66cd8ec69bd4c9535d92a267'

export const TYPE_EMPLOYEE = {
    admin: "admin",
    user: "user",
    adminWebsite: "adminWebsite",
    adminCourses: "adminCourses",
    adminOrders: "adminOrders",
    adminFileManager: "adminFileManager",
    adminUser: "adminUser"
};

export const baseURL = process.env.BUILD_MODE === 'dev'
    ? "http://localhost:8082"
    : process.env.BUILD_MODE === 'production'
        ? import.meta.env.VITE_API_URL : '';

export const baseClient = process.env.BUILD_MODE === 'dev'
    ? "http://localhost:5173"
    : process.env.BUILD_MODE === 'production'
        ? import.meta.env.VITE_CLIENT_URL : '';
