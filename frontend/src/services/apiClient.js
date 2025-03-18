const API_BASE = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("access_token");

export const apiClient = async (url, options = {}) => {
    const token = getToken();
    if (!token) {
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
        let errorDetail = "API Error";

        try {
            const errorJson = await response.json();
            if (errorJson.detail) {
                errorDetail = errorJson.detail;
            }
        } catch (_) {
            const fallbackText = await response.text();
            errorDetail = fallbackText || "API Error";
        }

        const error = new Error(errorDetail);
        error.detail = errorDetail;
        error.status = response.status;
        throw error;
    }

    return response.status !== 204 ? response.json() : null;
};
