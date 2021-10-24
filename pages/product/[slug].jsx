import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import NextLink from 'next/link'
import Image from 'next/image'
import {
	Grid,
	Link,
	List,
	ListItem,
	Typography,
	Card,
	Button,
	CircularProgress,
	TextField,
} from '@material-ui/core'
import Layout from '../../components/Layout'
import useStyles from '../../utils/styles'
import db from '../../utils/db'
import Product from '../../models/Product'
import { Store } from '../../utils/StoreProvider'
import { getError } from '../../utils/error'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import Rating from '@material-ui/lab/Rating'

export default function ProductScreen(props) {
	const { dispatch, state } = useContext(Store)
	const { userInfo } = state
	const { product } = props
	const { enqueueSnackbar } = useSnackbar()
	const classes = useStyles()
	const router = useRouter()
	const [reviews, setReviews] = useState([])
	const [rating, setRating] = useState(0)
	const [comment, setComment] = useState('')
	const [loading, setLoading] = useState(false)

	const submitHandler = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			await axios.post(
				`/api/products/${product._id}/reviews`,
				{
					rating,
					comment,
				},
				{
					headers: { authorization: `Bearer ${userInfo.token}` },
				}
			)
			setLoading(false)
			enqueueSnackbar('Review submitted successfully', { variant: 'success' })
			fetchReviews()
		} catch (err) {
			setLoading(false)
			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}

	//fetch reviews from db and set them
	const fetchReviews = async () => {
		try {
			const { data } = await axios.get(`/api/products/${product._id}/reviews`)
			setReviews(data)
		} catch (err) {
			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}

	useEffect(() => {
		fetchReviews()
	}, [])

	if (!product) {
		return <div>Product Not Found</div>
	}

	//add to cart handler function
	const addToCartHandler = async () => {
		//fetch product from backend
		const { data } = await axios.get(`/api/products/${product._id}`)
		// check if its already in cart and add one more
		const existItem = state.cart.cartItems.find((x) => x._id === product._id)
		const quantity = existItem ? existItem.quantity + 1 : 1
		//check stock before adding one more to cart
		if (data.countInStock < quantity) {
			window.alert('Sorry. Product is sold out.')
			return
		}
		//dispatch action to react context
		dispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...product, quantity },
		})
		//after adding item to cart, redirect user to cart
		router.push('/cart')
	}

	//add to wishlist handler
	const addToWishlistHandler = async () => {
		dispatch({
			type: 'WISHLIST_ADD_ITEM',
			payload: { ...product },
		})
	}

	return (
		<Layout title={product.name} description={product.description}>
			<div className={classes.section}>
				<NextLink href='/' passHref>
					<Link>
						<Typography>back to products</Typography>
					</Link>
				</NextLink>
			</div>

			{/* PRODUCT INFO AND ACTIONS */}
			<Grid container spacing={1}>
				{/* Image container */}
				<Grid item md={6} xs={12}>
					<Image
						src={product.image}
						alt={product.name}
						width={640}
						height={640}
						layout='responsive'></Image>
				</Grid>
				{/* Stats container */}
				<Grid item md={3} xs={12}>
					<List>
						<ListItem>
							<Typography component='h1' variant='h1'>
								{product.name}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography>Category: {product.category}</Typography>
						</ListItem>
						<ListItem>
							<Typography>Brand: {product.brand}</Typography>
						</ListItem>
						<ListItem>
							<Rating value={product.rating} readOnly></Rating>
							<Link href='#reviews'>
								<Typography>({product.numReviews} reviews)</Typography>
							</Link>
						</ListItem>
						<ListItem>
							<Typography> Description: {product.description}</Typography>
						</ListItem>
					</List>
				</Grid>

				{/* actions container */}
				<Grid item md={3} xs={12}>
					<Card>
						<List>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Price</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>€{product.price}</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Status</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>
											{product.countInStock > 0 ? 'In stock' : 'Unavailable'}
										</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Button
									fullWidth
									variant='contained'
									color='primary'
									onClick={addToCartHandler}>
									Add to cart
								</Button>
							</ListItem>
							<ListItem>
								<Button
									fullWidth
									variant='outlined'
									color='secondary'
									onClick={addToWishlistHandler}>
									Add To Wishlist
								</Button>
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>

			{/* CUSTOMERS REVIEWS SECTION */}
			<List>
				<ListItem>
					<Typography name='reviews' id='reviews' variant='h2'>
						Customer Reviews
					</Typography>
				</ListItem>

				{reviews.length === 0 && <ListItem>No review</ListItem>}
				{reviews.map((review) => (
					<ListItem key={review._id}>
						<Grid container>
							<Grid item className={classes.reviewItem}>
								<Typography>
									<strong>{review.name}</strong>
								</Typography>
								<Typography>{review.createdAt.substring(0, 10)}</Typography>
							</Grid>
							<Grid item>
								<Rating value={review.rating} readOnly />
								<Typography>{review.comment}</Typography>
							</Grid>
						</Grid>
					</ListItem>
				))}
				<ListItem>
					{userInfo ? (
						<form onSubmit={submitHandler} className={classes.reviewForm}>
							<List>
								<ListItem>
									<Typography variant='h2'>Leave your review</Typography>
								</ListItem>
								<ListItem>
									<TextField
										multiline
										variant='outlined'
										fullWidth
										name='review'
										label='Enter comment'
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
								</ListItem>
								<ListItem>
									<Rating
										name='simple-controlled'
										value={rating}
										onChange={(e) => setRating(e.target.value)}
									/>
								</ListItem>
								<ListItem>
									<Button
										type='submit'
										fullWidth
										variant='contained'
										color='primary'>
										Submit
									</Button>

									{loading && <CircularProgress />}
								</ListItem>
							</List>
						</form>
					) : (
						<Typography variant='h2'>
							Please{' '}
							<Link href={`/login?redirect=/product/${product.slug}`}>
								login
							</Link>{' '}
							to write a review
						</Typography>
					)}
				</ListItem>
			</List>
		</Layout>
	)
}

//get data from backend
export async function getServerSideProps(context) {
	//get slug from context
	const { params } = context
	const { slug } = params
	//connect to mongo db
	await db.connect()
	//get product that matches with slug. transform to plain js object with lean
	const product = await Product.findOne({ slug }, '-reviews').lean()
	//disconnect from db after geting data
	await db.disconnect()

	//return props to frontend and convert them to json object
	return {
		props: {
			product: db.convertDocToObj(product),
		},
	}
}
