"use client"

import { useEffect, useState } from "react"
import { getHistory } from "../api"
import "./history.css"

export default function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null) // track expanded item
    const [historyQuizAnswers, setHistoryQuizAnswers] = useState({})
    const [historyQuizSubmitted, setHistoryQuizSubmitted] = useState({})
    const [historyShowScore, setHistoryShowScore] = useState({})

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getHistory()
                setHistory(res.data)
            } catch (error) {
                console.error("Failed to fetch history:", error)
            }
            setLoading(false)
        }

        fetchHistory()
    }, [])

    const handleHistoryAnswerSelect = (historyIndex, questionIndex, selectedOption) => {
        const quizKey = `${historyIndex}-${questionIndex}`
        const historyKey = `history-${historyIndex}`

        if (historyQuizSubmitted[historyKey]) return // Prevent changes after submission

        setHistoryQuizAnswers((prev) => ({
            ...prev,
            [quizKey]: selectedOption,
        }))
    }

    const handleSubmitHistoryQuiz = (historyIndex, totalQuestions) => {
        const historyKey = `history-${historyIndex}`
        setHistoryQuizSubmitted((prev) => ({
            ...prev,
            [historyKey]: true,
        }))
        setHistoryShowScore((prev) => ({
            ...prev,
            [historyKey]: true,
        }))
    }

    const handleResetHistoryQuiz = (historyIndex, totalQuestions) => {
        const historyKey = `history-${historyIndex}`

        // Clear answers for this quiz
        const newAnswers = { ...historyQuizAnswers }
        for (let i = 0; i < totalQuestions; i++) {
            delete newAnswers[`${historyIndex}-${i}`]
        }

        setHistoryQuizAnswers(newAnswers)
        setHistoryQuizSubmitted((prev) => ({
            ...prev,
            [historyKey]: false,
        }))
        setHistoryShowScore((prev) => ({
            ...prev,
            [historyKey]: false,
        }))
    }

    const calculateHistoryScore = (historyIndex, quiz) => {
        if (!quiz || !Array.isArray(quiz)) return 0

        let correct = 0
        quiz.forEach((question, questionIndex) => {
            const quizKey = `${historyIndex}-${questionIndex}`
            if (historyQuizAnswers[quizKey] === question.correct) {
                correct++
            }
        })
        return correct
    }

    const getHistoryAnswersCount = (historyIndex, totalQuestions) => {
        let count = 0
        for (let i = 0; i < totalQuestions; i++) {
            const quizKey = `${historyIndex}-${i}`
            if (historyQuizAnswers[quizKey]) {
                count++
            }
        }
        return count
    }

    if (loading) {
        return (
            <div className="history-container">
                <div className="history-header">
                    <h2 className="history-title">
                        Study History
                    </h2>
                </div>
                <div className="loading-state">
                    <span className="loading-spinner"></span>
                    Loading history...
                </div>
            </div>
        )
    }

    return (
        <div className="history-container">
            <div className="history-header">
                <h2 className="history-title">
                    Study History
                </h2>
                <span className="history-count">{history.length} sessions</span>
            </div>

            <div className="history-content">
                {history.length === 0 ? (
                    <div className="empty-state">
                        <p>No study sessions yet</p>
                        <small>Your generated summaries will appear here</small>
                    </div>
                ) : (
                    <div className="history-list">
                        {history.map((item, idx) => {
                            const historyKey = `history-${idx}`
                            const totalQuestions = item.quiz?.length || 0
                            const score = calculateHistoryScore(idx, item.quiz)
                            const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
                            const answersCount = getHistoryAnswersCount(idx, totalQuestions)

                            return (
                                <div
                                    key={item._id}
                                    className={`history-item ${expanded === idx ? "expanded" : ""}`}
                                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                                >
                                    <div className="item-content">
                                        <div className="item-summary">
                                            <strong>Summary Preview:</strong>{" "}
                                            {Array.isArray(item.summary) ? item.summary.slice(0, 2).join(" | ") : item.summary}
                                        </div>
                                        <div className="item-date">
                                            <span className="date-icon">{new Date(item.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {expanded === idx && (
                                        <div className="item-details">
                                            {/* Full Summary */}
                                            <h4> Full Summary</h4>
                                            <ul>
                                                {item.summary.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>

                                            <h4> Practice Quiz</h4>

                                            {historyShowScore[historyKey] && (
                                                <div
                                                    className={`score-display ${percentage >= 70 ? "good-score" : percentage >= 50 ? "average-score" : "low-score"}`}
                                                >
                                                    <div className="score-content">
                                                        <span className="score-icon">
                                                            {percentage >= 70 ? "" : percentage >= 50 ? "" : ""}
                                                        </span>
                                                        <div className="score-text">
                                                            <h5>Quiz Complete!</h5>
                                                            <p>
                                                                You scored {score} out of {totalQuestions} ({percentage}%)
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="history-quiz-list">
                                                {item.quiz.map((q, qi) => (
                                                    <div key={qi} className="quiz-item">
                                                        <p className="question-text">
                                                            <span className="question-number">{qi + 1}.</span>
                                                            {q.question}
                                                        </p>
                                                        <div className="options-list">
                                                            {q.options.map((opt, oi) => {
                                                                const quizKey = `${idx}-${qi}`
                                                                const isSelected = historyQuizAnswers[quizKey] === opt
                                                                const isCorrect = opt === q.correct
                                                                const showCorrectAnswer = historyQuizSubmitted[historyKey] && isCorrect
                                                                const showWrongAnswer = historyQuizSubmitted[historyKey] && isSelected && !isCorrect

                                                                return (
                                                                    <button
                                                                        key={oi}
                                                                        className={`option-button ${isSelected ? "selected" : ""} ${showCorrectAnswer ? "correct" : ""
                                                                            } ${showWrongAnswer ? "wrong" : ""}`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleHistoryAnswerSelect(idx, qi, opt)
                                                                        }}
                                                                        disabled={historyQuizSubmitted[historyKey]}
                                                                    >
                                                                        <span className="option-letter">{String.fromCharCode(65 + oi)}</span>
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
                                                    {!historyQuizSubmitted[historyKey] ? (
                                                        <button
                                                            className="submit-quiz-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleSubmitHistoryQuiz(idx, totalQuestions)
                                                            }}
                                                            disabled={answersCount !== totalQuestions}
                                                        >
                                                            Submit Quiz ({answersCount}/{totalQuestions})
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="reset-quiz-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleResetHistoryQuiz(idx, totalQuestions)
                                                            }}
                                                        >
                                                            Try Again
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
