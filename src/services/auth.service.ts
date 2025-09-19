import { User, IUser } from "../models/user.model"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token"
import { Types } from "mongoose"

export const register = async (data: { name: string; email: string; password: string }) => {
	const existing = await User.findOne({ email: data.email })
	if (existing) throw { status: 400, message: "Email already in use" }

	const user = await User.create(data as Partial<IUser>)

	const { password, refreshToken, ...safe } = user.toObject()

	return safe
}

export const login = async (email: string, password: string) => {
	const user = await User.findOne({ email })
	if (!user) {
		throw { status: 401, message: "Invalid credentials!" }
	}

	const valid = await user.comparePassword(password)
	if (!valid) {
		throw { status: 401, message: "Invalid credentials!" }
	}

	const payload = { userId: user._id.toString(), role: user.role }
	const accessToken = signAccessToken(payload)
	const refreshToken = signRefreshToken(payload)

	const hashed = await bcrypt.hash(refreshToken, 10)
	user.refreshToken = hashed

	await user.save()
	return { accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
}

export const refreshTokens = async (token: string) => {
	let decoded: any
	try {
		decoded = verifyRefreshToken(token) as any
	} catch (error) {
		throw { status: 401, message: "Invalid refresh token!" }
	}

	const userId = decoded.userId
	if (!Types.ObjectId.isValid(userId)) {
		throw { status: 401, message: "Invalid token subject" }
	}

	const user = await User.findById(userId)
	if (!user || !user.refreshToken) {
		throw { status: 401, message: "Session not found" }
	}

	const valid = await bcrypt.compare(token, user.refreshToken)
	if (!valid) {
		throw { status: 401, message: "Refresh token revoked" }
	}

	const payload = { userId: user._id.toString(), role: user.role }
	const newAccess = signAccessToken(payload)
	const newRefresh = signRefreshToken(payload)
	user.refreshToken = await bcrypt.hash(newRefresh, 10)
	await user.save()

	return { accessToken: newAccess, refreshToken: newRefresh }
}

export const logout = async (userId: string) => {
	await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } })
}
