import express from "express"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/auth.route"
import userRoutes from "./routes/user.routes"

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

export default app
