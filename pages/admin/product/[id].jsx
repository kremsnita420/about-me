/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useEffect, useContext, useReducer } from 'react'
import {
	Grid,
	List,
	ListItem,
	Typography,
	Card,
	Button,
	ListItemText,
	TextField,
	CircularProgress,
} from '@material-ui/core'
import { getError } from '../../../utils/error'
import { Store } from '../../../utils/StoreProvider'
import Layout from '../../../components/Layout'
import useStyles from '../../../utils/styles'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

//define react reducer function
function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' }
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, error: '' }
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload }
		case 'UPDATE_REQUEST':
			return { ...state, loadingUpdate: true, errorUpdate: '' }
		case 'UPDATE_SUCCESS':
			return { ...state, loadingUpdate: false, errorUpdate: '' }
		case 'UPDATE_FAIL':
			return { ...state, loadingUpdate: false, errorUpdate: action.payload }
		case 'UPLOAD_REQUEST':
			return { ...state, loadingUpload: true, errorUpload: '' }
		case 'UPLOAD_SUCCESS':
			return {
				...state,
				loadingUpload: false,
				errorUpload: '',
			}
		case 'UPLOAD_FAIL':
			return { ...state, loadingUpload: false, errorUpload: action.payload }
		default:
			return state
	}
}

function ProductEdit({ params }) {
	const productId = params.id
	const { state } = useContext(Store)
	const [{ error, loading, loadingUpdate, loadingUpload }, dispatch] =
		useReducer(reducer, {
			loading: true,
			error: '',
		})
	const {
		setValue,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm()
	const { userInfo } = state
	const router = useRouter()
	const classes = useStyles()
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	useEffect(() => {
		if (!userInfo) {
			return router.push('/login')
		} else {
			const fetchData = async () => {
				try {
					//get data from backend api and set values to form fields
					const { data } = await axios.get(`/api/admin/products/${productId}`, {
						headers: { authorization: `Bearer ${userInfo.token}` },
					})
					dispatch({ type: 'FETCH_SUCCESS' })
					setValue('name', data.name)
					setValue('slug', data.slug)
					setValue('price', data.price)
					setValue('image', data.image)
					setValue('category', data.category)
					setValue('brand', data.brand)
					setValue('countInStock', data.countInStock)
					setValue('description', data.description)
				} catch (err) {
					dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
				}
			}
			fetchData()
		}
		//if user exist set values to form fields
		setValue('name', userInfo.name)
		setValue('email', userInfo.email)
	}, [])

	//upload image submit handler
	const uploadHandler = async (e) => {
		//create file and append selected image to it
		const file = e.target.files[0]
		const bodyFormData = new FormData()
		bodyFormData.append('file', file)

		//make a post request to db
		try {
			dispatch({ type: 'UPLOAD_REQUEST' })
			const { data } = await axios.post('/api/admin/upload', bodyFormData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: `Bearer ${userInfo.token}`,
				},
			})
			dispatch({ type: 'UPLOAD_SUCCESS' })
			//set value to cloudinary server image
			setValue('image', data.secure_url)
			enqueueSnackbar('File uploaded successfully', { variant: 'success' })
		} catch (err) {
			dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) })
			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}
	// update product to db submit handler
	const submitHandler = async ({
		name,
		slug,
		price,
		category,
		image,
		brand,
		countInStock,
		description,
	}) => {
		closeSnackbar()
		try {
			dispatch({ type: 'UPDATE_REQUEST' })
			await axios.put(
				`/api/admin/products/${productId}`,
				{
					name,
					slug,
					price,
					category,
					image,
					brand,
					countInStock,
					description,
				},
				{ headers: { authorization: `Bearer ${userInfo.token}` } }
			)
			dispatch({ type: 'UPDATE_SUCCESS' })

			enqueueSnackbar('Product updated successfully', { variant: 'success' })

			router.push('/admin/products')
		} catch (err) {
			dispatch({ type: 'UPDATE_FAIL', payload: getError(err) })

			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}

	return (
		<Layout title={`Edit Product ${productId}`}>
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
								<ListItem button component='a'>
									<ListItemText primary='Orders' />
								</ListItem>
							</NextLink>
							<NextLink href='/admin/products' passHref>
								<ListItem selected button component='a'>
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
								<Typography component='h1' variant='h1'>
									Edit Product {productId}
								</Typography>
							</ListItem>
							<ListItem>
								{loading && <CircularProgress />}
								{error && (
									<Typography className={classes.error}>{error}</Typography>
								)}
							</ListItem>
							<ListItem>
								<form
									onSubmit={handleSubmit(submitHandler)}
									className={classes.form}>
									<List>
										<ListItem>
											<Controller
												name='name'
												control={control}
												defaultValue=''
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant='outlined'
														fullWidth
														id='name'
														label='Name'
														error={Boolean(errors.name)}
														helperText={errors.name ? 'Name is required' : ''}
														{...field}
													/>
												)}
											/>
										</ListItem>
										<ListItem>
											<Controller
												name='slug'
												control={control}
												defaultValue=''
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant='outlined'
														fullWidth
														id='slug'
														label='Slug'
														error={Boolean(errors.slug)}
														helperText={errors.slug ? 'Slug is required' : ''}
														{...field}
													/>
												)}
											/>
										</ListItem>
										<ListItem>
											<Controller
												name='price'
												control={control}
												defaultValue=''
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant='outlined'
														fullWidth
														id='price'
														label='Price'
														error={Boolean(errors.price)}
														helperText={errors.price ? 'Price is required' : ''}
														{...field}
													/>
												)}
											/>
										</ListItem>
										<ListItem>
											<Controller
												name='image'
												control={control}
												defaultValue=''
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant='outlined'
														fullWidth
														id='image'
														label='Image'
														error={Boolean(errors.image)}
														helperText={errors.image ? 'Image is required' : ''}
														{...field}
													/>
												)}
											/>
										</ListItem>
										<ListItem>
											<Button variant='contained' component='label'>
												Upload File
												<input type='file' onChange={uploadHandler} hidden />
											</Button>
											{loadingUpload && <CircularProgress />}
										</ListItem>
										<ListItem>
											<Controller
												name='category'
												control={control}
												defaultValue=''
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant='outlined'
														fullWidth
														id='category'
														label='Category'
														error={Boolean(errors.category)}
														helperText={
															errors.category ? 'Category is required' : ''
														}
														{...field}
													/>
												)}
											/>
										</ListItem>
										<ListItem>
											<Controller
												name='brand'
												control={control}
												defaultValue=''
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant='outlined'
														fullWidth
														id='brand'
														label='Brand'
														error={Boolean(errors.brand)}
														helperText={errors.brand ? 'Brand is required' : ''}
														{...field}
													/>
												)}
											/>
										</ListItem>
										<ListItem>
											<Controller
												name='countInStock'
												control={control}
												defaultValue=''
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant='outlined'
														fullWidth
														id='countInStock'
														label='Count in stock'
														error={Boolean(errors.countInStock)}
														helperText={
															errors.countInStock
																? 'Count in stock is required'
																: ''
														}
														{...field}
													/>
												)}
											/>
										</ListItem>
										<ListItem>
											<Controller
												name='description'
												control={control}
												defaultValue=''
												rules={{
													required: true,
												}}
												render={({ field }) => (
													<TextField
														variant='outlined'
														fullWidth
														multiline
														id='description'
														label='Description'
														error={Boolean(errors.description)}
														helperText={
															errors.description
																? 'Description is required'
																: ''
														}
														{...field}
													/>
												)}
											/>
										</ListItem>

										<ListItem>
											<Button
												variant='contained'
												type='submit'
												fullWidth
												color='primary'>
												Update
											</Button>
										</ListItem>
										<ListItem>{loadingUpdate && <CircularProgress />}</ListItem>
									</List>
								</form>
							</ListItem>
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	)
}

//pass order id to frontend
export async function getServerSideProps({ params }) {
	return {
		props: {
			params,
		},
	}
}

// MAKE CART RENDER ON CLIENTSIDE
export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false })
