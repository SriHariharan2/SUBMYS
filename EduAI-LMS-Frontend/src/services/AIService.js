import api from "../api/axiosConfig";

// =====================================================
// AI CHAT
// =====================================================

const chat = (message) => {
    return api.post("/ai/chat", {
        message,
    });
};

// =====================================================
// EXPORT
// =====================================================

const AIService = {
    chat,
};

export default AIService;