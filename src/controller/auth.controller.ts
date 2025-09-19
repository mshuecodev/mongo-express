import { Request, Response, NextFunction } from "express"
import * as authService from "../services/auth.service"
import { ENV } from "../config/env"

const REFRESH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: ENV.COOKIE_SECURE,
	sameSite: (ENV.COOKIE_SAME_SITE as any) || "lax",
	path: "/api/auth/refresh"
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await authService.register(req.body)
		res.status(201).json({ success: true, data: user })
	} catch (error) {
		next(error)
	}
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body
		const { accessToken, refreshToken, user } = await authService.login(email, password)

		res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
		res.json({ success: true, data: { accessToken, user } })
	} catch (error) {
		next(error)
	}
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies?.refreshToken || req.body?.refreshToken

		if (!token) throw { status: 401, message: "No refresh token provided" }

		const { accessToken, refreshToken } = await authService.refreshTokens(token)

		res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS)
		res.json({ success: true, data: { accessToken } })
	} catch (error) {
		next(error)
	}
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = (req as any).user?.userId
		if (userId) await authService.logout(userId)

		// clear cookie
		res.clearCookie("refreshToken", { path: "api/auth/refresh" })
		res.json({ success: true })
	} catch (error) {
		next(error)
	}
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userPayload = (req as any).User
		res.json({ success: true, data: userPayload })
	} catch (error) {
		next(error)
	}
}
