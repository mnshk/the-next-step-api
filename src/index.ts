import cors from "cors"
import { configDotenv } from "dotenv"
import express from "express"
import { notesRouter } from "./routes/notes"
import dbConnect from "./services/dbConnect"

configDotenv()
dbConnect()

const app = express()
app.use(express.json())
app.use(cors())

app.use("/notes", notesRouter)

const PORT = process.env.PORT
if (PORT === undefined) throw new Error("PORT is undefined")

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
