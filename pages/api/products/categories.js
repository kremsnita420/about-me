import nc from "next-connect"
import Product from "../../../models/Product"
import db from "../../../utils/db"

//define next-connect handler
const handler = nc()

//connect to db and get categories
handler.get(async (req, res) => {
    //connect to db
    await db.connect()
    //return all products and filter out duplicates
    const categories = await Product.find().distinct('category');
    //disconnect from db
    await db.disconnect()
    //send categories to frontend
    res.send(categories)
})

export default handler