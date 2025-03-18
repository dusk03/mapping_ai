const API_BASE = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("access_token");

export const apiClient = async (url, options = {}) => {
    const token = getToken();
    if (!token) {
        console.error("Token not found!");
        throw new Error("Unauthorized");
    }

    const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
    };

    const response = await fetch(`${API_BASE}${url}`, config);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "API Error");
    }

    return response.status !== 204 ? response.json() : null;
};
