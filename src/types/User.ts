import { PushSubscription } from "web-push"

export type IUser = {
	username: string
	pushSubscription: PushSubscription
}
