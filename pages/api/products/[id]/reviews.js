// /api/products/:id/reviews
import mongoose from 'mongoose'
import nextConnect from 'next-connect'
import { onError } from '../../../../utils/error'
import db from '../../../../utils/db'
import Product from '../../../../models/Product'
import { isAuth } from '../../../../utils/auth'

//next connect handler
const handler = nextConnect({
    onError,
})

//fetch reviews from db
handler.get(async (req, res) => {
    db.connect()
    const product = await Product.findById(req.query.id)
    db.disconnect()
    if (product) {
        res.send(product.reviews)
    } else {
        res.status(404).send({ message: 'Product not found' })
    }
})

//create a new review, return error if product not found
handler.use(isAuth).post(async (req, res) => {
    await db.connect()
    const product = await Product.findById(req.query.id)

    if (product) {
        const existReview = product.reviews.find((x) => x.user == req.user._id)
        //if user has already made a review update it else create new review
        if (existReview) {
            await Product.updateOne(
                { _id: req.query.id, 'reviews._id': existReview._id },
                {
                    $set: {
                        'reviews.$.comment': req.body.comment,
                        'reviews.$.rating': Number(req.body.rating),
                    },
                }
            )

            // const updatedProduct = await Product.findById(req.query.id)
            // updatedProduct.numReviews = updatedProduct.reviews.length
            // updatedProduct.rating =
            //     updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
            //     updatedProduct.reviews.length
            // await updatedProduct.save()

            await db.disconnect()
            return res.send({ message: 'Review updated' })
        } else {
            //create new review
            const review = {
                user: mongoose.Types.ObjectId(req.user._id),
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            }
            //push created review to db
            product.reviews.push(review)
            //update nuber of reviews and rating
            product.numReviews = product.reviews.length
            product.rating =
                product.reviews.reduce((a, c) => c.rating + a, 0) /
                product.reviews.length
            //save updated product with review
            await product.save()
            await db.disconnect()
            res.status(201).send({
                message: 'Review submitted',
            })
        }
    } else {
        await db.disconnect()
        res.status(404).send({ message: 'Product Not Found' })
    }
})

export default handler
