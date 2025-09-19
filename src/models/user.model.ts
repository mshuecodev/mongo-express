import { Schema, model, Document, ObjectId } from "mongoose"
import bcrypt from "bcryptjs"

export type Role = "user" | "admin" | "editor"

export interface IUser extends Document {
	_id: ObjectId
	name: string
	email: string
	password: string
	role: Role
	refreshToken?: string
	comparePassword(candidatePassword: string): Promise<boolean>
}

const SALT_ROUNDS = 10

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["user", "admin", "editor"], default: "user" },
		refreshToken: { type: String }
	},
	{ timestamps: true }
)

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next()
	const salt = await bcrypt.genSalt(SALT_ROUNDS)
	this.password = await bcrypt.hash(this.password, salt)
	return next()
})

userSchema.methods.comparePassword = async function (candidatePassword: string) {
	return bcrypt.compare(candidatePassword, this.password)
}

export const User = model<IUser>("User", userSchema)
