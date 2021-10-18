import nc from "next-connect"
import bcrypt from 'bcryptjs'
import User from "../../../models/User"
import db from "../../../utils/db"
import { isAuth, signToken } from "../../../utils/auth"

//define next-connect handler
const handler = nc()
//onla auth user can access 
handler.use(isAuth);

//connect to db and find user
handler.put(async (req, res) => {
    //connect to db
    await db.connect()
    //get and update user
    const user = await User.findById(req.user._id)
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password ? bcrypt.hashSync(req.body.password) : user.password
    await user.save()
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