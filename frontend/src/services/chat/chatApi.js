import { apiClient } from "../apiClient"; // Đường dẫn có thể chỉnh lại nếu cần
import { API_BASE } from "@/config";


export const fetchChatHistory = (id) => {
    return apiClient(`/conversation/user/${id}`, { method: "GET" });
};

export const sendMessageToChatbot = async (id, message, token) => {
    try {
        const response = await fetch(`${API_BASE}/stream/chat/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${token}`,
            },
            body: `message=${encodeURIComponent(message)}`,
        });

        return response;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};


