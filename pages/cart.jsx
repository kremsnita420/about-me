import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import { Store } from '../utils/StoreProvider'
import {
	Button,
	Card,
	Grid,
	Link,
	List,
	ListItem,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core'
import axios from 'axios'
import { useRouter } from 'next/router'

function CartPage() {
	const router = useRouter()
	const { state, dispatch } = useContext(Store)
	const {
		cart: { cartItems },
	} = state

	// change cart item's quantity
	const updateCartHandler = async (item, quantity) => {
		//fetch product from backend
		const { data } = await axios.get(`/api/products/${item._id}`)
		if (data.countInStock < quantity) {
			window.alert('Sorry. Product is out of stock')
			return
		}
		//dispatch action to react context
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
	}

	//remove item from cart
	const removeItemHandler = async (item) => {
		dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
	}

	//checkout handler
	const checkoutHandler = () => {
		router.push('/shipping')
	}

	return (
		<Layout title='Shopping Cart'>
			<Typography variant='h1' component='h1'>
				Shopping Cart
			</Typography>
			{cartItems.length === 0 ? (
				<div>
					Cart is empty.{' '}
					<NextLink href='/' passHref>
						<Link>Go shopping.</Link>
					</NextLink>
				</div>
			) : (
				<Grid container spacing={1}>
					{/* CART ITEMS */}
					<Grid item xs={12} md={9}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Image</TableCell>
										<TableCell>Name</TableCell>
										<TableCell align='right'>Quantity</TableCell>
										<TableCell align='right'>Price</TableCell>
										<TableCell align='right'>Action</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{cartItems.map((item) => (
										<TableRow key={item._id}>
											{/* image */}
											<TableCell>
												<NextLink href={`/product/${item.slug}`} passHref>
													<Link>
														<Image
															src={item.image}
															alt={item.name}
															width={50}
															height={50}
														/>
													</Link>
												</NextLink>
											</TableCell>
											{/* name */}
											<TableCell>
												<NextLink href={`/product/${item.slug}`} passHref>
													<Link>
														<Typography>{item.name}</Typography>
													</Link>
												</NextLink>
											</TableCell>
											{/* quantity */}
											<TableCell align='right'>
												<Select
													value={item.quantity}
													onChange={(e) =>
														updateCartHandler(item, e.target.value)
													}>
													{[...Array(item.countInStock).keys()].map((x) => (
														<MenuItem key={x + 1} value={x + 1}>
															{x + 1}
														</MenuItem>
													))}
												</Select>
											</TableCell>
											{/* price */}
											<TableCell align='right'>{item.price}€</TableCell>
											{/* remove from cart */}
											<TableCell align='right'>
												<Button
													onClick={() => removeItemHandler(item)}
													variant='contained'
													color='secondary'>
													X
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>

					{/* CART ACTIONS */}
					<Grid item xs={12} md={3}>
						<Card>
							<List>
								{/* cart total price */}
								<ListItem>
									<Typography variant='h2'>
										Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
										items) : $
										{cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
									</Typography>
								</ListItem>
								{/* cart checkout button */}
								<ListItem>
									<Button
										onClick={checkoutHandler}
										variant='contained'
										color='primary'
										fullWidth>
										Checkout
									</Button>
								</ListItem>
							</List>
						</Card>
					</Grid>
				</Grid>
			)}
			{cartItems.length > 0 && (
				<div>
					<NextLink href='/' passHref>
						<Link>Continue shopping</Link>
					</NextLink>
				</div>
			)}
		</Layout>
	)
}

// MAKE CART RENDER ON CLIENTSIDE
export default dynamic(() => Promise.resolve(CartPage), { ssr: false })
