import express from "express";
import { generateStudy, history } from "../controllers/studyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-study-material", protect, generateStudy);
router.get("/history", protect, history);

export default router;
