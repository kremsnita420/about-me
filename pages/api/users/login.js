import nc from "next-connect"
import bcrypt from 'bcryptjs'
import User from "../../../models/User"
import db from "../../../utils/db"
import { signToken } from "../../../utils/auth"

//define next-connect handler
const handler = nc()

//connect to db and find user
handler.post(async (req, res) => {
    //connect to db
    await db.connect()
    //find user
    const user = await User.findOne({ email: req.body.email })
    //disconnect from db 
    await db.disconnect()
    //compare entered password with db
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        //genereate sign in token from users information and send it to frontend
        const token = signToken(user)
        res.send({
            token, _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(401).send({ message: 'Invalid user or password.' })
    }
})

export default handler