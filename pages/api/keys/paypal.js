import nc from "next-connect"
import { isAuth } from '../../../utils/auth'

//define next-connect handler
const handler = nc()

//only auth users can use it
handler.use(isAuth)

//create paypal client id, 'sb' = paypal sandbox
handler.get(async (req, res) => {
    await res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
}
)

export default handler
