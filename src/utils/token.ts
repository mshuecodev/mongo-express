import jwt, { SignOptions, JwtPayload } from "jsonwebtoken"
import { ENV } from "../config/env"

export interface TokenPayload extends JwtPayload {
	userId: string
	role: string
}

export const signAccessToken = (payload: TokenPayload): string => {
	return jwt.sign(payload, ENV.JWT_ACCESS_SECRET as string, { expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN as any })
}

export const signRefreshToken = (payload: TokenPayload) => {
	return jwt.sign(payload, ENV.JWT_REFRESH_SECRET as string, { expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN as any })
}

export const verifyAccessToken = (token: string) => {
	return jwt.verify(token, ENV.JWT_ACCESS_SECRET)
}

export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, ENV.JWT_REFRESH_SECRET)
}
