import { useState } from "react";
import AIQuizService from "../../services/AIQuizService";
import "./AIQuizGenerator.css";

function AIQuizGenerator() {
    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        subject: "",
        topic: "",
        difficulty: "Easy",
        numberOfQuestions: 5,
        questionType: "MCQ"
    });

    // =====================================================
    // QUIZ STATE
    // =====================================================

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // HANDLE FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "numberOfQuestions"
                    ? Number(value)
                    : value
        }));
    };

    // =====================================================
    // GENERATE QUIZ
    // =====================================================

    const generateQuiz = async (e) => {
        e.preventDefault();

        setError("");
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer("");
        setSubmitted(false);
        setScore(0);
        setQuizFinished(false);

        if (!formData.subject.trim()) {
            setError("Please enter a subject.");
            return;
        }

        if (!formData.topic.trim()) {
            setError("Please enter a topic.");
            return;
        }

        if (
            !formData.numberOfQuestions ||
            formData.numberOfQuestions < 1 ||
            formData.numberOfQuestions > 50
        ) {
            setError("Number of questions must be between 1 and 50.");
            return;
        }

        setLoading(true);

        try {
            console.log("Generating quiz with:", formData);

            const response =
                await AIQuizService.generateQuiz(formData);

            console.log("Quiz response:", response.data);

            if (
                response.data &&
                Array.isArray(response.data.questions) &&
                response.data.questions.length > 0
            ) {
                setQuestions(response.data.questions);
                setCurrentQuestionIndex(0);
                setSelectedAnswer("");
                setSubmitted(false);
                setScore(0);
                setQuizFinished(false);

                setTimeout(() => {
                    document
                        .getElementById("quiz-area")
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                }, 100);
            } else {
                setError("No questions were returned.");
            }
        } catch (error) {
            console.error(
                "AI Quiz Generation Error:",
                error
            );

            const backendMessage =
                error.response?.data?.message ||
                error.response?.data?.error;

            setError(
                backendMessage ||
                "Failed to generate quiz. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CURRENT QUESTION
    // =====================================================

    const currentQuestion =
        questions[currentQuestionIndex];

    // =====================================================
    // SELECT ANSWER
    // =====================================================

    const handleSelectAnswer = (answer) => {
        if (submitted) {
            return;
        }

        setError("");
        setSelectedAnswer(answer);
    };

    // =====================================================
    // CHECK ANSWER
    // =====================================================

    const isAnswerCorrect = () => {
        if (!currentQuestion) {
            return false;
        }

        const correctAnswer =
            currentQuestion.answer;

        if (
            selectedAnswer === null ||
            selectedAnswer === undefined
        ) {
            return false;
        }

        if (
            correctAnswer === null ||
            correctAnswer === undefined
        ) {
            return false;
        }

        const userAnswer =
            String(selectedAnswer)
                .trim()
                .toLowerCase();

        const expectedAnswer =
            String(correctAnswer)
                .trim()
                .toLowerCase();

        return userAnswer === expectedAnswer;
    };

    // =====================================================
    // SUBMIT ANSWER
    // =====================================================

    const handleSubmitAnswer = () => {
        if (!currentQuestion) {
            return;
        }

        if (
            selectedAnswer === null ||
            selectedAnswer === undefined ||
            String(selectedAnswer).trim() === ""
        ) {
            setError(
                "Please select or enter an answer first."
            );

            return;
        }

        setError("");

        const correct =
            isAnswerCorrect();

        if (correct) {
            setScore(
                (previousScore) =>
                    previousScore + 1
            );
        }

        setSubmitted(true);

        setTimeout(() => {
            document
                .getElementById("answer-result")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
        }, 100);
    };

    // =====================================================
    // NEXT QUESTION
    // =====================================================

    const handleNextQuestion = () => {
        const nextIndex =
            currentQuestionIndex + 1;

        if (nextIndex >= questions.length) {
            setQuizFinished(true);

            setTimeout(() => {
                document
                    .getElementById("quiz-finished")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }, 100);

            return;
        }

        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer("");
        setSubmitted(false);
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // RESTART CURRENT QUIZ
    // =====================================================

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer("");
        setSubmitted(false);
        setScore(0);
        setQuizFinished(false);
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // CREATE NEW QUIZ
    // =====================================================

    const createNewQuiz = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer("");
        setSubmitted(false);
        setScore(0);
        setQuizFinished(false);
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // PROGRESS
    // =====================================================

    const progress =
        questions.length > 0
            ? ((currentQuestionIndex + 1) /
                questions.length) *
            100
            : 0;

    const percentage =
        questions.length > 0
            ? Math.round(
                (score / questions.length) * 100
            )
            : 0;

    // =====================================================
    // RESULT MESSAGE
    // =====================================================

    const getScoreMessage = () => {
        if (percentage >= 90) {
            return "Outstanding work! 🎉";
        }

        if (percentage >= 75) {
            return "Great job! Keep it up! 👏";
        }

        if (percentage >= 50) {
            return "Good effort! Keep practicing! 💪";
        }

        return "Keep learning and try again! 📚";
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="ai-quiz-page">

            {/* =================================================
                GENERATOR HEADER
            ================================================= */}

            <div className="quiz-hero">

                <div className="quiz-hero-content">

                    <div className="quiz-robot">
                        🤖
                    </div>

                    <div>
                        <h1>
                           SUBMYS AI Quiz Generator
                        </h1>

                        <p>
                            Create personalized quizzes
                            and test your knowledge with
                            instant AI-powered feedback.
                        </p>
                    </div>

                </div>

                <div className="hero-badge">
                    ✨ Powered by AI
                </div>

            </div>

            {/* =================================================
                GENERATOR FORM
            ================================================= */}

            {questions.length === 0 && !loading && (

                <div className="generator-card">

                    <div className="section-title">
                        <div className="section-icon">
                            ⚙️
                        </div>

                        <div>
                            <h2>
                                Create Your Quiz
                            </h2>

                            <p>
                                Choose your subject,
                                topic and difficulty.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={generateQuiz}
                        className="quiz-form"
                    >

                        {/* SUBJECT */}

                        <div className="form-group full-width">

                            <label>
                                Subject
                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="e.g. Speaking, Learning and Stories, Communication"
                                
                                required
                            />

                        </div>

                        {/* TOPIC */}

                        <div className="form-group full-width">

                            <label>
                                Topic
                            </label>

                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                placeholder="e.g. Interview Standard, Public Speaking, Leadership Talks"
                                required
                            />

                        </div>

                        <div className="form-grid">

                            {/* DIFFICULTY */}

                            <div className="form-group">

                                <label>
                                    Difficulty
                                </label>

                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                >
                                    <option value="Easy">
                                        🟢 Easy
                                    </option>

                                    <option value="Medium">
                                        🟡 Medium
                                    </option>

                                    <option value="Hard">
                                        🔴 Hard
                                    </option>
                                </select>

                            </div>

                            {/* QUESTION TYPE */}

                            <div className="form-group">

                                <label>
                                    Question Type
                                </label>

                                <select
                                    name="questionType"
                                    value={formData.questionType}
                                    onChange={handleChange}
                                >
                                    <option value="MCQ">
                                        Multiple Choice
                                    </option>

                                    <option value="True/False">
                                        True / False
                                    </option>

                                    <option value="Short Answer">
                                        Short Answer
                                    </option>

                                    <option value="Mixed">
                                        Mixed
                                    </option>
                                </select>

                            </div>

                            {/* NUMBER */}

                            <div className="form-group">

                                <label>
                                    Number of Questions
                                </label>

                                <input
                                    type="number"
                                    name="numberOfQuestions"
                                    min="1"
                                    max="50"
                                    value={
                                        formData.numberOfQuestions
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        {/* ERROR */}

                        {error && (

                            <div className="quiz-error">
                                ❌ {error}
                            </div>

                        )}

                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="generate-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating Quiz...
                                </>
                            ) : (
                                <>
                                    🚀 Generate Quiz
                                </>
                            )}

                        </button>

                    </form>

                </div>

            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="loading-card">

                    <div className="loading-animation">
                        🤖
                    </div>

                    <h2>
                        Creating Your Quiz
                    </h2>

                    <p>
                        SUBMYS is preparing questions
                        based on your topic...
                    </p>

                    <div className="loading-bar">
                        <div></div>
                    </div>

                    <small>
                        This may take a few seconds
                    </small>

                </div>

            )}

            {/* =================================================
                QUIZ AREA
            ================================================= */}

            {questions.length > 0 &&
                !quizFinished &&
                currentQuestion && (

                    <div
                        id="quiz-area"
                        className="quiz-area"
                    >

                        {/* QUIZ TOP BAR */}

                        <div className="quiz-top-bar">

                            <div>

                                <span className="quiz-label">
                                    PRACTICE QUIZ
                                </span>

                                <h2>
                                    {formData.subject}
                                </h2>

                                <p>
                                    {formData.topic}
                                </p>

                            </div>

                            <div className="question-counter">
                                <strong>
                                    {currentQuestionIndex + 1}
                                </strong>

                                <span>
                                    / {questions.length}
                                </span>

                            </div>

                        </div>

                        {/* PROGRESS */}

                        <div className="progress-section">

                            <div className="progress-info">

                                <span>
                                    Your progress
                                </span>

                                <strong>
                                    {Math.round(progress)}%
                                </strong>

                            </div>

                            <div className="modern-progress">

                                <div
                                    style={{
                                        width: `${progress}%`
                                    }}
                                />

                            </div>

                        </div>

                        {/* QUESTION CARD */}

                        <div className="question-card">

                            <div className="question-number">
                                Question{" "}
                                {currentQuestionIndex + 1}
                            </div>

                            <h3 className="question-text">
                                {currentQuestion.question}
                            </h3>

                            {/* OPTIONS */}

                            {currentQuestion.options &&
                                currentQuestion.options.length > 0 && (

                                    <div className="options-list">

                                        {currentQuestion.options.map(
                                            (option, index) => {

                                                const isSelected =
                                                    selectedAnswer === option;

                                                const isCorrectOption =
                                                    submitted &&
                                                    String(option)
                                                        .trim()
                                                        .toLowerCase() ===
                                                    String(
                                                        currentQuestion.answer
                                                    )
                                                        .trim()
                                                        .toLowerCase();

                                                const isWrongSelected =
                                                    submitted &&
                                                    isSelected &&
                                                    !isAnswerCorrect();

                                                let optionClass =
                                                    "quiz-option";

                                                if (
                                                    isSelected &&
                                                    !submitted
                                                ) {
                                                    optionClass +=
                                                        " selected";
                                                }

                                                if (
                                                    isCorrectOption
                                                ) {
                                                    optionClass +=
                                                        " correct";
                                                }

                                                if (
                                                    isWrongSelected
                                                ) {
                                                    optionClass +=
                                                        " wrong";
                                                }

                                                return (

                                                    <button
                                                        type="button"
                                                        key={index}
                                                        className={optionClass}
                                                        disabled={submitted}
                                                        onClick={() =>
                                                            handleSelectAnswer(
                                                                option
                                                            )
                                                        }
                                                    >

                                                        <span className="option-letter">
                                                            {String.fromCharCode(
                                                                65 + index
                                                            )}
                                                        </span>

                                                        <span className="option-text">
                                                            {option}
                                                        </span>

                                                        {submitted &&
                                                            isCorrectOption && (
                                                                <span className="option-icon">
                                                                    ✓
                                                                </span>
                                                            )}

                                                        {submitted &&
                                                            isWrongSelected && (
                                                                <span className="option-icon">
                                                                    ✕
                                                                </span>
                                                            )}

                                                    </button>

                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            {/* SHORT ANSWER */}

                            {(
                                !currentQuestion.options ||
                                currentQuestion.options.length === 0
                            ) && (

                                    <div className="short-answer-area">

                                        <label>
                                            Your Answer
                                        </label>

                                        <textarea
                                            rows="5"
                                            placeholder="Type your answer here..."
                                            value={selectedAnswer}
                                            disabled={submitted}
                                            onChange={(e) =>
                                                handleSelectAnswer(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                )}

                            {/* ERROR */}

                            {error && (

                                <div className="quiz-error">
                                    ❌ {error}
                                </div>

                            )}

                            {/* SUBMIT */}

                            {!submitted && (

                                <button
                                    type="button"
                                    className="submit-answer-button"
                                    onClick={handleSubmitAnswer}
                                    disabled={
                                        !selectedAnswer ||
                                        String(selectedAnswer)
                                            .trim() === ""
                                    }
                                >
                                    ✓ Check Answer
                                </button>

                            )}

                        </div>

                        {/* =================================================
                            ANSWER RESULT
                        ================================================= */}

                        {submitted && (

                            <div
                                id="answer-result"
                                className="answer-result"
                            >

                                {isAnswerCorrect() ? (

                                    <div className="result-card correct-result">

                                        <div className="result-icon">
                                            ✓
                                        </div>

                                        <div>
                                            <h3>
                                                Correct! 🎉
                                            </h3>

                                            <p>
                                                Excellent work!
                                                You selected the
                                                correct answer.
                                            </p>
                                        </div>

                                    </div>

                                ) : (

                                    <div className="result-card wrong-result">

                                        <div className="result-icon">
                                            ✕
                                        </div>

                                        <div>
                                            <h3>
                                                Not quite!
                                            </h3>

                                            <p>
                                                That's okay.
                                                Review the correct
                                                answer and explanation
                                                below.
                                            </p>
                                        </div>

                                    </div>

                                )}

                                {/* CORRECT ANSWER */}

                                <div className="correct-answer-card">

                                    <div className="feedback-heading">
                                        <span>
                                            💡
                                        </span>

                                        <strong>
                                            Correct Answer
                                        </strong>
                                    </div>

                                    <p>
                                        {currentQuestion.answer}
                                    </p>

                                </div>

                                {/* EXPLANATION */}

                                {currentQuestion.explanation && (

                                    <div className="explanation-card">

                                        <div className="feedback-heading">
                                            <span>
                                                📖
                                            </span>

                                            <strong>
                                                Explanation
                                            </strong>
                                        </div>

                                        <p>
                                            {currentQuestion.explanation}
                                        </p>

                                    </div>

                                )}

                                {/* NEXT */}

                                <button
                                    type="button"
                                    className="next-question-button"
                                    onClick={handleNextQuestion}
                                >

                                    {currentQuestionIndex + 1 <
                                        questions.length
                                        ? "Next Question →"
                                        : "Finish Quiz ✓"}

                                </button>

                            </div>

                        )}

                    </div>

                )}

            {/* =================================================
                FINAL RESULT
            ================================================= */}

            {quizFinished && (

                <div
                    id="quiz-finished"
                    className="final-result"
                >

                    <div className="final-result-card">

                        <div className="trophy">
                            🏆
                        </div>

                        <span className="completed-label">
                            QUIZ COMPLETED
                        </span>

                        <h1>
                            {getScoreMessage()}
                        </h1>

                        <p>
                            You have completed your
                            {` ${formData.topic}`} quiz.
                        </p>

                        <div className="score-circle">

                            <div>
                                <strong>
                                    {percentage}%
                                </strong>

                                <span>
                                    Score
                                </span>
                            </div>

                        </div>

                        <div className="score-summary">

                            <div>
                                <strong>
                                    {score}
                                </strong>

                                <span>
                                    Correct
                                </span>
                            </div>

                            <div>
                                <strong>
                                    {questions.length - score}
                                </strong>

                                <span>
                                    Incorrect
                                </span>
                            </div>

                            <div>
                                <strong>
                                    {questions.length}
                                </strong>

                                <span>
                                    Total
                                </span>
                            </div>

                        </div>

                        <div className="final-buttons">

                            <button
                                type="button"
                                className="restart-button"
                                onClick={restartQuiz}
                            >
                                🔄 Practice Again
                            </button>

                            <button
                                type="button"
                                className="new-quiz-button"
                                onClick={createNewQuiz}
                            >
                                ✨ Create New Quiz
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AIQuizGenerator;