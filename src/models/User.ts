import { model, Schema } from "mongoose"
import { IUser } from "../types/User"

const userSchema = new Schema<IUser>({
	username: String,
	pushSubscription: Schema.Types.Mixed,
})

const User = model("User", userSchema)

export default User
