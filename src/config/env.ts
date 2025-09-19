import dotenv from "dotenv"
dotenv.config()

export const ENV = {
	NODE_ENV: process.env.NODE_ENV ?? "development",
	PORT: process.env.PORT || 3000,
	MONGO_URI: process.env.MONGO_URI ?? "",
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "your_jwt_access_secret",
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret",
	ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
	REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
	COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
	COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || "Lax"
}
