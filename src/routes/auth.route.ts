import { Router } from "express"
import * as authController from "../controller/auth.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/refresh", authController.refresh)
router.post("/logout", authController.logout)
router.get("/me", authController.me)

export default router
