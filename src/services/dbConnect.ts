import mongoose from "mongoose"

export default async function dbConnect() {
	try {
		const DB_URI = process.env.DB_URI
		if (DB_URI === undefined) throw new Error("DB_URI is undefined")
		await mongoose.connect(DB_URI, {
			dbName: "the-next-step",
		})
		console.log("Connected to database")
	} catch (err) {
		console.log("Failed to connect to the database", err)
	}
}
