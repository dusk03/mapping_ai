import { AIME_API } from "@/config";
import axios from "axios";

export const fetchSimilarQuestions = async (question, topK = 3) => {
    const response = await fetch(`${AIME_API}/rag/similar-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, top_k: topK }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch similar questions");
    }

    const data = await response.json();
    return data.similar_questions || [];
};

export const fetchDocuments = async () => {
    const res = await axios.get(`${AIME_API}/rag/available-docs?collection=questions`);
    return res.data.available_docs || [];
};

export const uploadDocument = async (file, onProgress) => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await axios.post(`${AIME_API}/rag/upload?collection=questions`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onProgress,
    });

    return response;
};

export const deleteDocument = async (docName) => {
    return await axios.delete(`${AIME_API}/rag/clear/?collection=questions`, {
        data: { doc_names: [docName] },
        headers: { "Content-Type": "application/json" },
    });
};
