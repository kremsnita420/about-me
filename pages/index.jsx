import Layout from '../components/Layout'
import db from '../utils/db'
import Product from '../models/Product'
import axios from 'axios'
/* eslint-disable @next/next/no-img-element */
import { Store } from '../utils/StoreProvider'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import ProductItem from '../components/ProductItem'
import NextLink from 'next/link'
import { Grid, Link, Typography } from '@material-ui/core'
import Carousel from 'react-material-ui-carousel'
import useStyles from '../utils/styles'

export default function HomePage(props) {
	const { topRatedProducts, featuredProducts } = props
	const { dispatch, state } = useContext(Store)
	const router = useRouter()
	const classes = useStyles()

	//add to cart handler function
	const addToCartHandler = async (product) => {
		//fetch product from backend
		const { data } = await axios.get(`/api/products/${product._id}`)
		// check if its already in cart and add one more
		const existItem = state.cart.cartItems.find((x) => x._id === product._id)
		const quantity = existItem ? existItem.quantity + 1 : 1
		//check cart stock before adding one more to cart
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
		<Layout>
			<Carousel className={classes.mt1} animation='slide'>
				{featuredProducts.map((product) => (
					<NextLink
						key={product._id}
						href={`/product/${product.slug}`}
						passHref>
						<Link>
							<img
								src={product.featuredImage}
								alt={product.name}
								className={classes.featuredImage}></img>
						</Link>
					</NextLink>
				))}
			</Carousel>
			<Typography variant='h2'>Popular Products</Typography>
			<Grid container spacing={3}>
				{topRatedProducts.map((product) => (
					<Grid item md={4} key={product.name}>
						<ProductItem
							product={product}
							addToCartHandler={addToCartHandler}
						/>
					</Grid>
				))}
			</Grid>
		</Layout>
	)
}

//get data from backend
export async function getServerSideProps() {
	//connect to mongo db
	await db.connect()
	//get all products from products model. transform with plain js object with lean
	const featuredProductsDocs = await Product.find(
		{ isFeatured: true },
		'-reviews'
	)
		.lean()
		.limit(3)

	const topRatedProductsDocs = await Product.find({}, '-reviews')
		.lean()
		.sort({
			rating: -1,
		})
		.limit(6)
	//disconnect from db after geting data
	await db.disconnect()

	//return props to frontend and convert them to json object
	return {
		props: {
			featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
			topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
		},
	}
}
