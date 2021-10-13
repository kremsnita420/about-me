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
    //create user
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false,
    })
    //save user to db
    const user = await newUser.save()
    //disconnect from db 
    await db.disconnect()

    const token = signToken(user)
    res.send({
        token, _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    })

})

export default handler