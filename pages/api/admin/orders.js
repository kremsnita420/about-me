import nc from 'next-connect'
import Order from '../../../models/Order'
import { isAuth, isAdmin } from '../../../utils/auth'
import db from '../../../utils/db'
import { onError } from '../../../utils/error'

const handler = nc({
    onError,
})

//only admin can access data
handler.use(isAuth, isAdmin)

//get orders of all users from backend
handler.get(async (req, res) => {
    await db.connect()
    const orders = await Order.find({}).populate('user', 'name')
    await db.disconnect()

    res.send(orders)
});

export default handler