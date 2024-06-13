import cors from "cors"
import { configDotenv } from "dotenv"
import express from "express"
import { notesRouter } from "./routes/notes"
import dbConnect from "./services/dbConnect"
import User from "./models/User"
import "./cron"

configDotenv()
dbConnect()

const app = express()
app.use(express.json())
app.use(cors())

app.use("/notes", notesRouter)
app.post("/save-push-subscription", async (req, res) => {
	User.deleteMany({ username: "default" })
	const user = await User.create({
		username: "default",
		pushSubscription: req.body,
	})
	res.status(201).send()
})

const PORT = process.env.PORT
if (PORT === undefined) throw new Error("PORT is undefined")

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
