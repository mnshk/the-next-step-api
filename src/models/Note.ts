import { model, Schema } from "mongoose"
import { Note as INote } from "../types/Note"

const noteSchema = new Schema<INote>({
	title: String,
	description: String,
	status: String,
	startsAt: String,
	endsAt: String,
	instanceStatus: String,
	timeBlock: {
		starts: String,
		ends: String,
		days: [Boolean, Boolean, Boolean, Boolean, Boolean, Boolean, Boolean],
	},
	tags: [String],
	dependencies: [String],
	doneStreak: Number,
	abandonStreak: Number,
	createdAt: String,
	modifiedAt: String,
	closedAt: String,
	settings: {
		notification: {
			shouldNotifyAboutOverdue: Boolean,
		},
	},
	notifications: {
		notifiedAboutStart: Boolean,
		notifiedAboutOverdue: Boolean,
	},
})

const Note = model("Note", noteSchema)

export default Note
