import { Router } from "express"
import { createNote, deleteAllNotes, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notes"

export const notesRouter = Router()

notesRouter.post("/", createNote)
notesRouter.get("/", getAllNotes)
notesRouter.get("/:id", getNoteById)
notesRouter.patch("/:id", updateNote)
notesRouter.delete("/:id", deleteNote)
notesRouter.delete("/", deleteAllNotes)
