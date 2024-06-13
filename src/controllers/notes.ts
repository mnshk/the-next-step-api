import { Request, Response } from "express"
import Note from "../models/Note"

export async function createNote(req: Request, res: Response) {
	try {
		await Note.create(req.body)
		res.status(201).send()
	} catch (err) {
		console.log("Error creating Note", err)
		res.status(500).send()
	}
}

export async function getNoteById(req: Request, res: Response) {
	try {
		const note = await Note.findById(req.params.id)
		res.json(note)
	} catch (err) {
		console.log("Error finding Note by id", err)
		res.status(500).send()
	}
}

export async function getAllNotes(_: Request, res: Response) {
	try {
		res.json(await Note.find({}))
	} catch (err) {
		console.log("Error finding all Notes", err)
		res.status(500).send()
	}
}

export async function updateNote(req: Request, res: Response) {
	try {
		await Note.findByIdAndUpdate(req.params.id, req.body)
		res.send()
	} catch (err) {
		console.log("Error updating Note", err)
		res.status(500).send()
	}
}

export async function deleteNote(req: Request, res: Response) {
	try {
		await Note.findByIdAndDelete(req.params.id)
		res.send()
	} catch (err) {
		console.log("Error deleting a Note", err)
		res.status(500).send()
	}
}

export async function deleteAllNotes(_: Request, res: Response) {
	try {
		await Note.deleteMany({})
		res.send()
	} catch (err) {
		console.log("Error deleting all Notes", err)
		res.status(500).send()
	}
}
