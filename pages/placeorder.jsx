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
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core'
import useStyles from '../utils/styles'
import CheckoutWizard from '../components/CheckoutWizard'

function PlaceOrder() {
	const classes = useStyles()
	const { state } = useContext(Store)
	const {
		cart: { cartItems, shippingAddress, paymentMethod },
	} = state

	//calculate price, tax, shipping, total price
	const round2decimal = (num) => Math.round(num * 100 + Number.EPSILON) / 100 //123.456 = 123.46
	//price
	const itemsPrice = round2decimal(
		cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
	)
	//shipping is free if price is over 200
	const shippingPrice = itemsPrice > 200 ? 0 : 15
	//tax price
	const taxPrice = round2decimal(itemsPrice * 0.22)
	//total price
	const totalPrice = round2decimal(itemsPrice + shippingPrice + taxPrice)

	return (
		<Layout title='Place Order'>
			<CheckoutWizard activeStep={3} />
			<Typography variant='h1' component='h1'>
				Place Order
			</Typography>

			<Grid container spacing={1}>
				{/* ORDER DETAILS*/}
				<Grid item xs={12} md={9}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component='h2' variant='h2'>
									Shipping Address
								</Typography>
							</ListItem>
							<ListItem>
								{shippingAddress.fullName},
								{shippingAddress.address},{shippingAddress.city}
								,{shippingAddress.postalCode},
								{shippingAddress.country},
							</ListItem>
						</List>
					</Card>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component='h2' variant='h2'>
									Pament Method
								</Typography>
							</ListItem>
							<ListItem>{paymentMethod}</ListItem>
						</List>
					</Card>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component='h2' variant='h2'>
									Order Items
								</Typography>
							</ListItem>
							<ListItem>
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Image</TableCell>
												<TableCell>Name</TableCell>
												<TableCell align='right'>
													Quantity
												</TableCell>
												<TableCell align='right'>
													Price
												</TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											{cartItems.map((item) => (
												<TableRow key={item._id}>
													{/* image */}
													<TableCell>
														<NextLink
															href={`/product/${item.slug}`}
															passHref>
															<Link>
																<Image
																	src={
																		item.image
																	}
																	alt={
																		item.name
																	}
																	width={50}
																	height={50}
																/>
															</Link>
														</NextLink>
													</TableCell>
													{/* name */}
													<TableCell>
														<NextLink
															href={`/product/${item.slug}`}
															passHref>
															<Link>
																<Typography>
																	{item.name}
																</Typography>
															</Link>
														</NextLink>
													</TableCell>
													{/* quantity */}
													<TableCell align='right'>
														<Typography>
															{item.quantity}
														</Typography>
													</TableCell>
													{/* price */}
													<TableCell align='right'>
														<Typography>
															{item.price}€
														</Typography>
													</TableCell>
													{/* remove from cart */}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</ListItem>
						</List>
					</Card>
				</Grid>

				{/* ORDER SUMMARY */}
				<Grid item xs={12} md={3}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography variant='h2'>
									Order Summary
								</Typography>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Items:</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>{itemsPrice}€</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Tax:</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>{taxPrice}€</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Shipping:</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>
											{shippingPrice}€
										</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>
											<strong>Total:</strong>
										</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography>
											<strong>{totalPrice}€</strong>
										</Typography>
									</Grid>
								</Grid>
							</ListItem>
							{/* place order button */}
							<ListItem>
								<Button
									variant='contained'
									color='primary'
									fullWidth>
									Place Order
								</Button>
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	)
}

// RENDER ON CLIENTSIDE
export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })
