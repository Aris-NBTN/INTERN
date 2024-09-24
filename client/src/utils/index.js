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

const apiRoot = process.env.BUILD_MODE === 'dev'
    ? "http://localhost:8082"
    : process.env.BUILD_MODE === 'production'
        ? "https://www.tranhgohoangminh.com"
        : '';

export const baseURL = apiRoot;

const clientRoot = process.env.BUILD_MODE === 'dev'
    ? "http://localhost:5173"
    : process.env.BUILD_MODE === 'production'
        ? "https://hmweb3d.com"
        : '';

export const baseClient = clientRoot;


