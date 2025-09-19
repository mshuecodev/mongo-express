import { Router } from "express"
import * as userController from "../controller/user.controller"
import { authenticate, authorize } from "../middlewares/auth.middleware"

const router = Router()

router.use(authenticate, authorize("admin"))

router.get("/", userController.listUsers)
router.get("/:id", userController.getUserbyId)
router.patch("/:id/role", userController.updateUserRole)
router.delete("/:id", userController.deleteUser)

export default router
