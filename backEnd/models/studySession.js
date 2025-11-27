import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        inputText: {
            type: String,
            required: true,
        },
        summary: {
            type: [String],
            required: true,
        },
        quiz: [
            {
                question: { type: String, required: true },
                options: [{ type: String, required: true }],
                correct: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

const StudySession = mongoose.model("studySession", studySessionSchema);
export default StudySession;
