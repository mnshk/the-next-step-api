import { ObjectId } from "mongodb"

export type NoteStatus = "NEW" | "PENDING" | "OVERDUE" | "DONE" | "ABANDONED"
export type NoteInstanceStatus = "PENDING" | "DONE" | "ABANDONED"

export type Note = {
	_id: ObjectId
	title: string
	description: string
	status: NoteStatus
	startsAt: string
	endsAt: string
	instanceStatus: NoteInstanceStatus
	timeBlock: {
		starts: string
		ends: string
		days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
	}
	tags: string[]
	dependencies: string[]
	doneStreak: number
	abandonStreak: number
	createdAt: string
	modifiedAt: string
	closedAt: string
	settings: {
		notification: {
			shouldNotifyAboutOverdue: boolean
		}
	}
	notifications: {
		notifiedAboutStart: boolean
		notifiedAboutOverdue: boolean
	}
}
