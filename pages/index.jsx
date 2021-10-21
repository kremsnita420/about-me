import {
	Grid,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Typography,
	CardActions,
	Button,
} from '@material-ui/core'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import db from '../utils/db'
import Product from '../models/Product'
import axios from 'axios'
import { Store } from '../utils/StoreProvider'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Rating from '@material-ui/lab/Rating'

export default function HomePage(props) {
	const { products } = props
	const { dispatch, state } = useContext(Store)
	const router = useRouter()

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
			<div>
				<Typography component='h1' variant='h1'>
					Products
				</Typography>
				<Grid container spacing={3}>
					{products.map((product) => (
						<Grid item md={4} key={product.name}>
							<Card>
								<NextLink href={`/product/${product.slug}`} passHref>
									<CardActionArea>
										<CardMedia
											component='img'
											image={product.image}
											title={product.name}></CardMedia>
										<CardContent>
											<Typography>{product.name}</Typography>
											<Rating value={product.rating} readOnly></Rating>
										</CardContent>
									</CardActionArea>
								</NextLink>
								<CardActions>
									<Typography>€ {product.price}</Typography>
									<Button
										onClick={() => addToCartHandler(product)}
										variant='contained'
										size='large'
										color='secondary'>
										Add to cart
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			</div>
		</Layout>
	)
}

//get data from backend
export async function getServerSideProps() {
	//connect to mongo db
	await db.connect()
	//get all products from products model. transform with plain js object with lean
	const products = await Product.find({}).lean()
	//disconnect from db after geting data
	await db.disconnect()

	//return props to frontend and convert them to json object
	return {
		props: {
			products: products.map(db.convertDocToObj),
		},
	}
}
