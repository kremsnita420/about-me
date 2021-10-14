/* eslint-disable no-mixed-spaces-and-tabs */
import {
	List,
	ListItem,
	Typography,
	TextField,
	Button,
	Link,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import { Store } from '../utils/StoreProvider'
import useStyles from '../utils/styles'
import { Controller, useForm } from 'react-hook-form'
import CheckoutWizard from '../components/CheckoutWizard'

export default function Shipping() {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm()
	const router = useRouter()
	//login?redirect=/shipping
	const { redirect } = router.query
	const classes = useStyles()

	//fetch from store provider
	const { state, dispatch } = useContext(Store)
	const { userInfo } = state

	useEffect(() => {
		if (!userInfo) {
			router.push('/login?redirect=/shipping')
		}
	}, [router, userInfo])

	//login submit handler
	const submitHandler = ({
		fullName,
		address,
		city,
		postalCode,
		country,
	}) => {
		//save user data into store provider
		dispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: {
				fullName,
				address,
				city,
				postalCode,
				country,
			},
		})
		//save user to cookie
		Cookies.set(
			'shippingAddress',
			JSON.stringify({
				fullName,
				address,
				city,
				postalCode,
				country,
			})
		)
		//redirect user
		router.push('/payment')
	}

	return (
		<Layout title='Shipping Address'>
			<CheckoutWizard activeStep={1} />
			<form
				onSubmit={handleSubmit(submitHandler)}
				className={classes.form}>
				<Typography component='h1' variant='h1'>
					Shipping Address
				</Typography>
				<List>
					<ListItem>
						<Controller
							name='fullName'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='fullName'
									label='Full Name'
									error={Boolean(errors.fullName)}
									helperText={
										errors.fullName
											? errors.fullName.type ===
											  'minLength'
												? 'Full Name length is more than 1'
												: 'Full Name is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name='address'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='address'
									label='Address'
									error={Boolean(errors.address)}
									helperText={
										errors.address
											? errors.address.type ===
											  'minLength'
												? 'Address length is more than 1'
												: 'Address is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name='city'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='city'
									label='City'
									error={Boolean(errors.city)}
									helperText={
										errors.city
											? errors.city.type === 'minLength'
												? 'City length is more than 1'
												: 'City is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name='postalCode'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='postalCode'
									label='Postal Code'
									error={Boolean(errors.postalCode)}
									helperText={
										errors.postalCode
											? errors.postalCode.type ===
											  'minLength'
												? 'Postal Code length is more than 1'
												: 'Postal Code is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name='country'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='country'
									label='Country'
									error={Boolean(errors.country)}
									helperText={
										errors.country
											? errors.country.type ===
											  'minLength'
												? 'Country length is more than 1'
												: 'Country is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Button
							variant='contained'
							type='submit'
							fullWidth
							color='primary'>
							Continue
						</Button>
					</ListItem>
				</List>
			</form>
		</Layout>
	)
}
