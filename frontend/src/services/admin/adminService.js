// src/api/userService.js
import { apiClient } from "../apiClient";

export const fetchUsers = async () => {
    return apiClient("/admin/users", { method: "GET" });

};

export const fetchChatbots = async () => {
    return apiClient("/chatbot/admin", { method: "GET" });

};

export const deleteChatbot = async (uid) => {
    return apiClient(`/chatbot/admin/${uid}`, { method: "DELETE" });
};


export const addChatbot = (chatbot) => {
    return apiClient("/chatbot/admin", {
        method: "POST",
        body: JSON.stringify({
            name: chatbot.short_name,
            code_name: chatbot.slug,
            description: chatbot.description,
        }),
    });
};

export const fetchFreeChatbots = async () => {
    const res = await fetch("/openrouter/models/find?max_price=0");
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error fetching free chatbots");
    }
    const data = await res.json();
    return data.data.models;
};