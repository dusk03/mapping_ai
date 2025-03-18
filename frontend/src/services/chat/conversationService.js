import { apiClient } from "../apiClient";

export const getChats = () => {
    return apiClient("/conversation/user/", { method: "GET" });
};

export const deleteChat = (chatId) => {
    return apiClient(`/conversation/user/${chatId}`, { method: "DELETE" });
};

export const updateChatTitle = (chatId, newTitle) => {
    return apiClient(`/conversation/user/${chatId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: newTitle }),
    });
};
