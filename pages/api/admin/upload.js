import nextConnect from 'next-connect'
import { isAuth, isAdmin } from '../../../utils/auth'
import { onError } from '../../../utils/error'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

//set cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//export clodinary config
export const config = {
    api: {
        bodyParser: false,
    },
}

const handler = nextConnect({ onError })

//middleware for handling multipart/form-data
const upload = multer()

//handler for uploading files
handler.use(isAuth, isAdmin, upload.single('file')).post(async (req, res) => {
    //define cloudinary upload stream for images
    const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result)
                } else {
                    reject(error)
                }
            })
            streamifier.createReadStream(req.file.buffer).pipe(stream)
        })
    }
    const result = await streamUpload(req)
    res.send(result)
})

export default handler
