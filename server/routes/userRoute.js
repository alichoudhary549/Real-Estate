import express from "express";
import {
  bookVisit,
  cancelBooking,
  modifyBooking,
  createUser,
  getAllBookings,
  getAllFavorites,
  toFav,
} from "../controllers/userCntrl.js";
import protect from "../config/auth.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id", protect, bookVisit);
router.post("/allBookings", protect, getAllBookings);
router.post("/removeBooking/:id", protect, cancelBooking);
router.post("/modifyBooking/:id", protect, modifyBooking);
router.post("/toFav/:rid", protect, toFav);
router.post("/allFav/", protect, getAllFavorites);
export { router as userRoute };