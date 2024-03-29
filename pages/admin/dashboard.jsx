import {
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Grid,
	List,
	ListItem,
	ListItemText,
	Typography,
} from '@material-ui/core'
import { Bar } from 'react-chartjs-2'
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
				summary: action.payload,
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
	const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
		loading: true,
		summary: { salesData: [], productCountData: [] },
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
				const { data } = await axios.get('/api/admin/summary', {
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
								<ListItem selected button component='a'>
									<ListItemText primary='Admin Dashboard' />
								</ListItem>
							</NextLink>
							<NextLink href='/admin/orders' passHref>
								<ListItem button component='a'>
									<ListItemText primary='Orders' />
								</ListItem>
							</NextLink>
							<NextLink href='/admin/products' passHref>
								<ListItem button component='a'>
									<ListItemText primary='Products' />
								</ListItem>
							</NextLink>
							<NextLink href='/admin/users' passHref>
								<ListItem button component='a'>
									<ListItemText primary='Users' />
								</ListItem>
							</NextLink>
						</List>
					</Card>
				</Grid>
				<Grid item md={9} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								{loading ? (
									<CircularProgress />
								) : error ? (
									<Typography className={classes.error}>{error}</Typography>
								) : (
									<Grid container spacing={5}>
										<Grid item md={3}>
											<Card raised>
												<CardContent>
													<Typography variant='h1' component='h1'>
														€{summary.ordersPrice}
													</Typography>
													<Typography>Sales</Typography>
												</CardContent>
												<CardActions>
													<NextLink href='/admin/orders' passHref>
														<Button size='small' color='primary'>
															View Sales
														</Button>
													</NextLink>
												</CardActions>
											</Card>
										</Grid>
										<Grid item md={3}>
											<Card raised>
												<CardContent>
													<Typography variant='h1' component='h1'>
														{summary.ordersCount}
													</Typography>
													<Typography>Orders</Typography>
												</CardContent>
												<CardActions>
													<NextLink href='/admin/orders' passHref>
														<Button size='small' color='primary'>
															View Orders
														</Button>
													</NextLink>
												</CardActions>
											</Card>
										</Grid>
										<Grid item md={3}>
											<Card raised>
												<CardContent>
													<Typography variant='h1' component='h1'>
														{summary.productsCount}
													</Typography>
													<Typography>Unique Products</Typography>
												</CardContent>
												<CardActions>
													<NextLink href='/admin/products' passHref>
														<Button size='small' color='primary'>
															View Products
														</Button>
													</NextLink>
												</CardActions>
											</Card>
										</Grid>
										<Grid item md={3}>
											<Card raised>
												<CardContent>
													<Typography variant='h1' component='h1'>
														{summary.usersCount}
													</Typography>
													<Typography>Users</Typography>
												</CardContent>
												<CardActions>
													<NextLink href='/admin/users' passHref>
														<Button size='small' color='primary'>
															View Users
														</Button>
													</NextLink>
												</CardActions>
											</Card>
										</Grid>
									</Grid>
								)}
							</ListItem>
							<ListItem>
								<Typography component='h1' variant='h1'>
									Sales Chart
								</Typography>
							</ListItem>
							<ListItem>
								<Bar
									data={{
										labels: summary.salesData.map((x) => x._id),
										datasets: [
											{
												label: 'Sales',
												backgroundColor: 'rgba(162,222,208,1)',
												data: summary.salesData.map((x) => x.totalSales),
											},
										],
									}}
									options={{
										legend: {
											display: true,
											position: 'right',
										},
									}}
								/>
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
