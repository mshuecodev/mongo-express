import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/token"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	try {
		const auth = req.headers.authorization || ""
		const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null

		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized" })
		}

		const payload = verifyAccessToken(token) as any

		;(req as any).user = { userId: payload.userId, role: payload.role }
		next()
	} catch (error) {
		return res.status(401).json({ success: false, message: "Invalid or expired token." })
	}
}

export const authorize = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = (req as any).user
		if (!user) return res.status(401).json({ success: false, message: "Unauthorized" })

		if (roles.length && !roles.includes(user.role)) {
			return res.status(401).json({ success: false, message: "Forbidden" })
		}
		next()
	}
}
