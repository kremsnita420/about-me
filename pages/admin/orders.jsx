import {
	Button,
	Card,
	CircularProgress,
	Grid,
	List,
	ListItem,
	ListItemText,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect, useReducer } from 'react'
import Layout from '../../components/Layout'
import { getError } from '../../utils/error'
import { Store } from '../../utils/StoreProvider'
import NextLink from 'next/link'
import useStyles from '../../utils/styles'

//define react reducer function
function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' }
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				orders: action.payload,
				error: '',
			}
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload }
		default:
			state
	}
}

function AdminDashboard() {
	const { state } = useContext(Store)
	const { userInfo } = state
	const router = useRouter()
	const classes = useStyles()

	//react reducer hook
	const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
		loading: true,
		orders: [],
		error: '',
	})

	useEffect(() => {
		if (!userInfo) {
			router.push('/login')
		}
		//fetch data details from backend
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' })
				const { data } = await axios.get('/api/admin/orders', {
					headers: { authorization: `Bearer ${userInfo.token}` },
				})
				dispatch({ type: 'FETCH_SUCCESS', payload: data })
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
			}
		}
		//call function
		fetchData()
	}, [])

	return (
		<Layout title='Order History'>
			<Grid container spacing={1}>
				<Grid item md={3} xs={12}>
					<Card className={classes.section}>
						<List>
							<NextLink href='/admin/dashboard' passHref>
								<ListItem button component='a'>
									<ListItemText primary='Admin Dashboard' />
								</ListItem>
							</NextLink>
							<NextLink href='/admin/orders' passHref>
								<ListItem selected button component='a'>
									<ListItemText primary='Orders' />
								</ListItem>
							</NextLink>
							<NextLink href='/admin/products' passHref>
								<ListItem button component='a'>
									<ListItemText primary='Products' />
								</ListItem>
							</NextLink>
						</List>
					</Card>
				</Grid>
				<Grid item md={9} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component='h1' variant='h1'>
									Orders
								</Typography>
							</ListItem>
							<ListItem>
								{loading ? (
									<CircularProgress />
								) : error ? (
									<Typography className={classes.error}>{error}</Typography>
								) : (
									<TableContainer>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell>ORDER</TableCell>
													<TableCell>DATE</TableCell>
													<TableCell>USER</TableCell>
													<TableCell>TOTAL</TableCell>
													<TableCell>PAID</TableCell>
													<TableCell>DELIVERED</TableCell>
													<TableCell>ACTION</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{orders.map((order) => (
													<TableRow key={order._id}>
														<TableCell>{order._id.substring(12, 24)}</TableCell>
														<TableCell>{order.createdAt}</TableCell>
														<TableCell>
															{order.user ? order.user.name : 'DELETED USER'}
														</TableCell>
														<TableCell>€{order.totalPrice}</TableCell>
														<TableCell>
															{order.isPaid
																? `paid at ${order.paidAt}`
																: 'not paid'}
														</TableCell>
														<TableCell>
															{order.isDelivered
																? `delivered at ${order.deliveredAt}`
																: 'not delivered'}
														</TableCell>
														<TableCell>
															<NextLink href={`/order/${order._id}`} passHref>
																<Button variant='contained'>Details</Button>
															</NextLink>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								)}
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	)
}

// MAKE CART RENDER ON CLIENTSIDE
export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false })
