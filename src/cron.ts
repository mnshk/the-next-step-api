import cron from "node-cron"
import webPush from "web-push"
import Note from "./models/Note"
import moment from "moment"
import User from "./models/User"
import { configDotenv } from "dotenv"
import { INote } from "./types/Note"

configDotenv()

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY

if (VAPID_PUBLIC_KEY === undefined || VAPID_PRIVATE_KEY === undefined) {
	throw new Error("VAPID_KEY is undefined")
}

webPush.setVapidDetails("mailto:mk9569192204@gmail.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

function doesNoteHaveTimeBlock(note: INote) {
	return note.timeBlock.starts !== ""
}

function isNoteActive(note: INote) {
	if (doesNoteHaveTimeBlock(note)) {
		return note.instanceStatus !== "DONE" && note.instanceStatus !== "ABANDONED" && note.instanceStatus !== "NEW"
	}
	return note.status !== "DONE" && note.status !== "ABANDONED" && note.status !== "NEW"
}

function hasNoteStarted(note: INote) {
	if (doesNoteHaveTimeBlock(note)) {
		return moment(moment.now()).isAfter(moment(note.timeBlock.starts, "HH:mm")) && note.timeBlock.days[new Date().getDay()]
	}
	return moment(moment.now()).isAfter(moment(note.startsAt))
}

function hasNoteEnded(note: INote) {
	if (doesNoteHaveTimeBlock(note)) {
		return moment(moment.now()).isAfter(moment(note.timeBlock.ends, "HH:mm"))
	}
	return moment(moment.now()).isAfter(moment(note.endsAt))
}

async function sendNotification(note: INote, body: string) {
	const user = await User.findOne({ username: "default" })
	if (!user) {
		throw new Error("No User found")
	}
	webPush.sendNotification(
		user.pushSubscription,
		JSON.stringify({
			title: note.title,
			body,
		})
	)
}

cron.schedule("*/5 * * * * *", async () => {
	console.log("---------CRON JOB------")
	const notes = await Note.find({})

	notes.forEach(async note => {
		// Reset Instance Status
		// if (moment(moment.now()).isSame(moment("00:00", "HH:mm"))) {
		// 	note.instanceStatus = "NEW"
		// 	note.save()
		// }

		if (doesNoteHaveTimeBlock(note)) {
			if (note.instanceStatus === "NEW" && hasNoteStarted(note)) {
				note.instanceStatus = "PENDING"
			}
			if ((note.instanceStatus === "PENDING" || note.instanceStatus === "NEW") && hasNoteEnded(note)) {
				note.instanceStatus = "OVERDUE"
			}
		}
		if (note.status === "NEW" && hasNoteStarted(note)) {
			note.status = "PENDING"
		}
		if ((note.status === "PENDING" || note.instanceStatus === "NEW") && hasNoteEnded(note)) {
			note.status = "OVERDUE"
		}

		if (isNoteActive(note)) {
			if (!note.notifications.notifiedAboutStart && hasNoteStarted(note)) {
				sendNotification(note, "Task started")
				note.notifications.notifiedAboutStart = true
			}
			if (note.settings.notification.shouldNotifyAboutOverdue && !note.notifications.notifiedAboutOverdue && hasNoteEnded(note)) {
				sendNotification(note, "Task Overdue")
				note.notifications.notifiedAboutOverdue = true
			}
		}
		note.save()
	})
})
