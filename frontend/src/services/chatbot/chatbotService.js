// api/chatbotService.js
import { apiClient } from "../apiClient";

export const getUserChatbots = async () => {
    const data = await apiClient("/chatbot/user", { method: "GET" });
    return data.map((bot) => ({
        label: bot.name.charAt(0).toUpperCase() + bot.name.slice(1),
        key: bot.uid,
        chat_with_file: bot.chat_with_file,
    }));
};
