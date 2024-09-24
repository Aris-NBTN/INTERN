export const WHITELIST_DOMAINS = [
    'https://hmweb3d.com',
    'http://localhost:5173',
    'http://192.168.1.43:5173'
]

export const TYPE_EMPLOYEE = {
    admin: "admin",
    user: "user",
    doctor: "doctor",
    administrative: "administrative",
    sales: "sales",
};

const apiRoot = process.env.BUILD_MODE === 'dev'
    ? "http://localhost:8082"
    : process.env.BUILD_MODE === 'production'
        ? "https://tranhgohoangminh.com"
        : '';
export const BaseServer = apiRoot

const apiClient = process.env.BUILD_MODE === 'dev'
    ? "http://localhost:5173"
    : process.env.BUILD_MODE === 'production'
        ? "https://www.hmweb3d.com"
        : '';
export const BaseClient = apiClient
