import React, { useContext } from 'react'
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
} from '@material-ui/core'
import Layout from '../../components/Layout'
import useStyles from '../../utils/styles'
import db from '../../utils/db'
import Product from '../../models/Product'
import { Store } from '../../utils/StoreProvider'
import { useRouter } from 'next/router'

export default function ProductScreen(props) {
	const { dispatch, state } = useContext(Store)
	const { product } = props
	const classes = useStyles()
	const router = useRouter()

	if (!product) {
		return <div>Product Not Found</div>
	}

	//add to cart handler function
	const addToCartHandler = async () => {
		//fetch product from backend
		const { data } = await axios.get(`/api/products/${product._id}`)
		// check if its already in cart and add one more
		const existItem = state.cart.cartItems.find(
			(x) => x._id === product._id
		)
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

	return (
		<Layout title={product.name} description={product.description}>
			<div className={classes.section}>
				<NextLink href='/' passHref>
					<Link>
						<Typography>back to products</Typography>
					</Link>
				</NextLink>
			</div>
			<Grid container spacing={1}>
				<Grid item md={6} xs={12}>
					<Image
						src={product.image}
						alt={product.name}
						width={640}
						height={640}
						layout='responsive'></Image>
				</Grid>
				<Grid item md={3} xs={12}>
					<List>
						<ListItem>
							<Typography component='h1' variant='h1'>
								{product.name}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography>
								Category: {product.category}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography>Brand: {product.brand}</Typography>
						</ListItem>
						<ListItem>
							<Typography>
								Rating: {product.rating} stars (
								{product.numReviews} reviews)
							</Typography>
						</ListItem>
						<ListItem>
							<Typography>
								{' '}
								Description: {product.description}
							</Typography>
						</ListItem>
					</List>
				</Grid>
				<Grid item md={3} xs={12}>
					<Card>
						<List>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Price</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>
											€{product.price}
										</Typography>
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
											{product.countInStock > 0
												? 'In stock'
												: 'Unavailable'}
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
						</List>
					</Card>
				</Grid>
			</Grid>
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
	const product = await Product.findOne({ slug }).lean()
	//disconnect from db after geting data
	await db.disconnect()

	//return props to frontend and convert them to json object
	return {
		props: {
			product: db.convertDocToObj(product),
		},
	}
}
