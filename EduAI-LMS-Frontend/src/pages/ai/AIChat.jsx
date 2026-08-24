import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AIService from "../../services/AIService";
import "./AIChat.css";

function AIChat() {

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            text: "Hello! I'm SUBMYS.",
            time: getCurrentTime()
        },
        {
            id: 2,
            sender: "ai",
            text: "I'm your personal learning assistant. Ask me anything about your courses, programming, assignments, concepts, or exam preparation.",
            time: getCurrentTime()
        }
    ]);

    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    /*
     * Scroll to latest message
     */
    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, loading]);


    /*
     * Get current time
     */
    function getCurrentTime() {

        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    }


    /*
     * Send message
     */
    const sendMessage = async () => {

        const trimmedMessage = message.trim();

        if (!trimmedMessage || loading) {
            return;
        }

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: trimmedMessage,
            time: getCurrentTime()
        };

        setMessages(prev => [
            ...prev,
            userMessage
        ]);

        setMessage("");

        setLoading(true);

        try {

            const response = await AIService.chat(trimmedMessage);

            const aiResponse =
                response?.data?.response ||
                "Sorry, I couldn't generate a response.";

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "ai",
                    text: aiResponse,
                    time: getCurrentTime()
                }
            ]);

        } catch (error) {

            console.error(
                "AI Chat Error:",
                error
            );

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "ai",
                    text: "Sorry, something went wrong while contacting SUBMYS. Please try again.",
                    time: getCurrentTime(),
                    error: true
                }
            ]);

        } finally {

            setLoading(false);

        }

    };


    /*
     * Enter = send
     *
     * Shift + Enter = new line
     */
    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    };


    /*
     * Quick suggestions
     */
    const handleSuggestion = (text) => {

        setMessage(text);

        setTimeout(() => {

            textareaRef.current?.focus();

        }, 50);

    };


    /*
     * Clear conversation
     */
    const clearChat = () => {

        const confirmed = window.confirm(
            "Are you sure you want to clear this conversation?"
        );

        if (!confirmed) {
            return;
        }

        setMessages([
            {
                id: Date.now(),
                sender: "ai",
                text: "Hello! I'm SUBMYS.",
                time: getCurrentTime()
            },
            {
                id: Date.now() + 1,
                sender: "ai",
                text: "Your conversation has been cleared. How can I help you learn today?",
                time: getCurrentTime()
            }
        ]);

        setMessage("");

    };


    return (

        <DashboardLayout>

            <div className="eduai-chat-page">

                <div className="eduai-chat-container">

                    {/* ================= HEADER ================= */}

                    <div className="eduai-chat-header">

                        <div className="eduai-header-left">

                            <div className="eduai-avatar">

                                🤖

                            </div>

                            <div>

                                <h3>
                                    SUBMYS Assistant
                                </h3>

                                <div className="eduai-status">

                                    <span className="status-dot"></span>

                                    <span>
                                        Online • AI Learning Assistant
                                    </span>

                                </div>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="clear-chat-button"
                            onClick={clearChat}
                            disabled={loading}
                        >

                            <span>
                                🗑️
                            </span>

                            Clear Chat

                        </button>

                    </div>


                    {/* ================= CHAT BODY ================= */}

                    <div className="eduai-chat-body">

                        {messages.length <= 2 && (

                            <div className="eduai-welcome">

                                <div className="welcome-icon">
                                    🤖
                                </div>

                                <h2>
                                    How can I help you?
                                </h2>

                                <p>
                                    Ask me about your Doubts,
                                    courses, assignments,
                                    concepts, or exam preparation.
                                </p>

                                <div className="suggestion-title">
                                    Try asking:
                                </div>

                                <div className="suggestion-container">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSuggestion(
                                                "Explain your concepts in simple words"
                                            )
                                        }
                                    >
                                        💡 Explain about my subject ?
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSuggestion(
                                                "Give me some practice questions for Java"
                                            )
                                        }
                                    >
                                        📝 Give me practice questions
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSuggestion(
                                                "Help me prepare for my exam"
                                            )
                                        }
                                    >
                                        🎯 Help me prepare for an exam
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* ================= MESSAGES ================= */}

                        <div className="messages-wrapper">

                            {messages.map((msg) => (

                                <div
                                    key={msg.id}
                                    className={`message-row ${
                                        msg.sender === "user"
                                            ? "user-row"
                                            : "ai-row"
                                    }`}
                                >

                                    {msg.sender === "ai" && (

                                        <div className="small-avatar">

                                            🤖

                                        </div>

                                    )}


                                    <div className="message-content">

                                        <div
                                            className={`message-bubble ${
                                                msg.sender === "user"
                                                    ? "user-bubble"
                                                    : "ai-bubble"
                                            } ${
                                                msg.error
                                                    ? "error-bubble"
                                                    : ""
                                            }`}
                                        >

                                            {msg.text}

                                        </div>

                                        <div
                                            className={`message-time ${
                                                msg.sender === "user"
                                                    ? "user-time"
                                                    : ""
                                            }`}
                                        >

                                            {msg.time}

                                        </div>

                                    </div>

                                </div>

                            ))}


                            {/* ================= TYPING ================= */}

                            {loading && (

                                <div className="message-row ai-row">

                                    <div className="small-avatar">
                                        🤖
                                    </div>

                                    <div className="message-content">

                                        <div className="typing-bubble">

                                            <span></span>
                                            <span></span>
                                            <span></span>

                                        </div>

                                        <div className="typing-text">
                                            SUBMYS is thinking...
                                        </div>

                                    </div>

                                </div>

                            )}

                            <div ref={bottomRef}></div>

                        </div>

                    </div>


                    {/* ================= INPUT AREA ================= */}

                    <div className="eduai-input-area">

                        <div className="input-wrapper">

                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Ask EduAI anything..."
                                rows="1"
                                maxLength={2000}
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="send-button"
                                onClick={sendMessage}
                                disabled={
                                    loading ||
                                    !message.trim()
                                }
                                title="Send message"
                            >

                                ➤

                            </button>

                        </div>


                        <div className="input-footer">

                            <span>
                                Press <strong>Enter</strong> to send
                                {" • "}
                                <strong>Shift + Enter</strong> for new line
                            </span>

                            <span>
                                {message.length}/2000
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default AIChat;