import { User, IUser } from "../models/user.model"
import { Types } from "mongoose"

export const listUsers = async (page = 1, limit = 10) => {
	const skip = (page - 1) * limit

	const [users, total] = await Promise.all([User.find({}, "-password -refreshToken").skip(skip).limit(limit).lean(), User.countDocuments()])

	return {
		users,
		page,
		total,
		pages: Math.ceil(total / limit)
	}
}

export const getUserbyId = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw { status: 400, message: "Invalid user id" }
	}
	const user = await User.findById(id, "-password -refreshToken").lean()

	if (!user) {
		throw { status: 404, message: "User not found" }
	}
	return user
}

export const updateUserRole = async (id: string, role: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw { status: 400, message: "Invalid user id" }
	}

	if (!["user", "admin", "editor"].includes(role)) {
		throw { status: 400, message: "Invalid role" }
	}

	const user = await User.findByIdAndUpdate(id, { $set: { role } }, { new: true, select: "-password -refreshToken" }).lean()

	if (!user) {
		throw { status: 404, message: "User not found" }
	}
	return user
}

export const deleteUser = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw { status: 400, message: "Invalid user id" }
	}
	const user = await User.findByIdAndDelete(id, { projection: "-password -refreshToken" }).lean()

	if (!user) {
		throw { status: 404, message: "User not found" }
	}
	return user
}
