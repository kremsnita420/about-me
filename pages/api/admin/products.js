import nc from 'next-connect'
import Product from '../../../models/Product'
import { isAuth, isAdmin } from '../../../utils/auth'
import db from '../../../utils/db'
import { onError } from '../../../utils/error'

const handler = nc({
    onError,
})

//only admin can access data
handler.use(isAuth, isAdmin)

//get products of all users from backend
handler.get(async (req, res) => {
    await db.connect()
    const products = await Product.find({})
    await db.disconnect()

    res.send(products)
});

export default handler