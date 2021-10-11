import nc from "next-connect"
import Product from "../../../models/Product"
import db from "../../../utils/db"

//define next-connect handler
const handler = nc()

//connect to db and get find products
handler.get(async (req, res) => {
    //connect to db
    await db.connect()
    //return all products
    const products = await Product.find({})
    //disconnect from db
    await db.disconnect()
    //send products to frontend
    res.send(products)
})

export default handler