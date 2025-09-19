import { Request, Response, NextFunction } from "express"
import * as userService from "../services/user.service"

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) | 10

		const data = await userService.listUsers(page, limit)
		res.json({ success: true, data })
	} catch (error) {
		next(error)
	}
}

export const getUserbyId = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await userService.getUserbyId(req.params.id)
		console.log("data", data)
		res.json({ success: true, data })
	} catch (error) {
		next(error)
	}
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { role } = req.body
		const data = await userService.updateUserRole(req.params.id, role)

		res.json({ success: true, data })
	} catch (error) {
		next(error)
	}
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await userService.deleteUser(req.params.id)
		res.json({ success: true, data })
	} catch (error) {
		next(error)
	}
}
