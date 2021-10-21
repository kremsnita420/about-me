import nc from "next-connect"
import Product from "../../../../models/Product"
import db from "../../../../utils/db"

//define next-connect handler
const handler = nc()

//connect to db and get find products
handler.get(async (req, res) => {
    //connect to db
    await db.connect()
    //return product by id
    const product = await Product.findById(req.query.id)
    //disconnect from db
    await db.disconnect()
    //send products to frontend
    res.send(product)
})

export default handler