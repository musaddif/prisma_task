import express from "express";
import { checkout } from "../controllers/auth.controller.js";
// import { signupStart, signupComplete } from "../controllers/auth.controller.js";


const router = express.Router();

// router.post("/signup/start", signupStart);
// router.post("/signup/complete", signupComplete);

router.post("/checkout", checkout);


export default router;