const fallbackApiUrl = "http://localhost:5000";
const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APT_URL || fallbackApiUrl;

export const API_URL = rawApiUrl.replace(/\/$/, "");
