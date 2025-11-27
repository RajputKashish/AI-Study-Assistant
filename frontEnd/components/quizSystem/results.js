
import { useState } from "react"
import "./results.css"

export default function Results({ result }) {
    const [userAnswers, setUserAnswers] = useState({})
    const [showScore, setShowScore] = useState(false)
    const [quizSubmitted, setQuizSubmitted] = useState(false)

    if (!result) return null

    const handleAnswerSelect = (questionIndex, selectedOption) => {
        if (quizSubmitted) return // Prevent changes after submission

        setUserAnswers((prev) => ({
            ...prev,
            [questionIndex]: selectedOption,
        }))
    }

    const handleSubmitQuiz = () => {
        setQuizSubmitted(true)
        setShowScore(true)
    }

    const handleResetQuiz = () => {
        setUserAnswers({})
        setShowScore(false)
        setQuizSubmitted(false)
    }

    const calculateScore = () => {
        if (!result.quiz || !Array.isArray(result.quiz)) return 0

        let correct = 0
        result.quiz.forEach((question, index) => {
            if (userAnswers[index] === question.correct) {
                correct++
            }
        })
        return correct
    }

    const totalQuestions = result.quiz?.length || 0
    const score = calculateScore()
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

    return (
        <div className="results-container">
            <div className="results-header">
                <h2 className="results-title">
                    Generated Study Material
                </h2>
            </div>

            <div className="results-content">
                {/* --- Summary Section --- */}
                <div className="summary-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            Summary
                        </h3>
                    </div>
                    <div className="summary-content">
                        <ul>
                            {Array.isArray(result.summary) ? (
                                result.summary.map((point, idx) => <li key={idx}>{point}</li>)
                            ) : (
                                <p>{result.summary}</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* --- Quiz Section --- */}
                <div className="quiz-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            Practice Quiz
                        </h3>
                        <span className="quiz-count">{totalQuestions} questions</span>
                    </div>

                    {showScore && (
                        <div
                            className={`score-display ${percentage >= 70 ? "good-score" : percentage >= 50 ? "average-score" : "low-score"}`}
                        >
                            <div className="score-content">
                                <div className="score-text">
                                    <h4>Quiz Complete!</h4>
                                    <p>
                                        You scored {score} out of {totalQuestions} ({percentage}%)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="quiz-content">
                        <div className="quiz-list">
                            {Array.isArray(result.quiz) &&
                                result.quiz.map((q, index) => (
                                    <div key={index} className="quiz-item">
                                        <p className="question-text">
                                            <span className="question-number">{index + 1}.</span>
                                            {q.question}
                                        </p>
                                        <div className="options-list">
                                            {q.options.map((opt, i) => {
                                                const isSelected = userAnswers[index] === opt
                                                const isCorrect = opt === q.correct
                                                const showCorrectAnswer = quizSubmitted && isCorrect
                                                const showWrongAnswer = quizSubmitted && isSelected && !isCorrect

                                                return (
                                                    <button
                                                        key={i}
                                                        className={`option-button ${isSelected ? "selected" : ""} ${showCorrectAnswer ? "correct" : ""
                                                            } ${showWrongAnswer ? "wrong" : ""}`}
                                                        onClick={() => handleAnswerSelect(index, opt)}
                                                        disabled={quizSubmitted}
                                                    >
                                                        <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                                        <span className="option-text">{opt}</span>
                                                        {showCorrectAnswer && <span className="check-icon"></span>}
                                                        {showWrongAnswer && <span className="cross-icon"></span>}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {totalQuestions > 0 && (
                            <div className="quiz-controls">
                                {!quizSubmitted ? (
                                    <button
                                        className="submit-quiz-btn"
                                        onClick={handleSubmitQuiz}
                                        disabled={Object.keys(userAnswers).length !== totalQuestions}
                                    >
                                        Submit Quiz ({Object.keys(userAnswers).length}/{totalQuestions})
                                    </button>
                                ) : (
                                    <button className="reset-quiz-btn" onClick={handleResetQuiz}>
                                        Try Again
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
