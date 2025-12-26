import express from "express";
import { createResidency, getAllResidencies, getResidency, getDBStatus, searchProperties } from "../controllers/resdCntrl.js";
import protect from "../config/auth.js";
const router = express.Router();

router.post("/create", protect, createResidency)
router.get("/search", searchProperties) // Search route must be before /:id to avoid route conflicts
router.get("/allresd", getAllResidencies)
router.get('/status', getDBStatus)
router.get("/:id", getResidency)
export {router as residencyRoute}