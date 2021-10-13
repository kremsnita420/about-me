/* eslint-disable no-mixed-spaces-and-tabs */
import {
	List,
	ListItem,
	Typography,
	TextField,
	Button,
	Link,
} from '@material-ui/core'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import { Store } from '../utils/StoreProvider'
import useStyles from '../utils/styles'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

export default function Register() {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm()
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const router = useRouter()
	//login?redirect=/shipping
	const { redirect } = router.query
	const classes = useStyles()

	//fetch from store provider
	const { state, dispatch } = useContext(Store)
	const { userInfo } = state

	useEffect(() => {
		if (userInfo) {
			router.push('/')
		}
	}, [router, userInfo])

	//login submit handler
	const submitHandler = async ({
		name,
		email,
		password,
		confirmPassword,
	}) => {
		closeSnackbar()
		if (password !== confirmPassword) {
			enqueueSnackbar("Passwords don't match", { variant: 'error' })
			return
		}
		//make a request to database
		try {
			const { data } = await axios.post('/api/users/register', {
				name,
				email,
				password,
			})
			//save user data into store provider
			dispatch({ type: 'USER_LOGIN', payload: data })
			//save user to cookie
			Cookies.set('userInfo', JSON.stringify(data))
			//redirect user
			router.push(redirect || '/')
		} catch (error) {
			enqueueSnackbar(
				error.response.data
					? error.response.data.message
					: error.message,
				{ variant: 'error' }
			)
		}
	}

	return (
		<Layout title='Register'>
			{/* FORM START */}
			<form
				onSubmit={handleSubmit(submitHandler)}
				className={classes.form}>
				<Typography component='h1' variant='h1'>
					Register
				</Typography>
				<List>
					{/* NAME */}
					<ListItem>
						<Controller
							name='name'
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
									id='name'
									label='Name'
									inputProps={{ type: 'name' }}
									error={Boolean(errors.name)}
									helperText={
										errors.name
											? errors.name.type === 'minLength'
												? 'Name length is more than 1'
												: 'Name is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					{/* EMAIL */}
					<ListItem>
						<Controller
							name='email'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								pattern:
									/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='email'
									label='Email'
									inputProps={{ type: 'email' }}
									error={Boolean(errors.email)}
									helperText={
										errors.email
											? errors.email.type === 'pattern'
												? 'Email is not valid'
												: 'Email is required'
											: ''
									}
									{...field}
								/>
							)}
						/>
					</ListItem>
					{/* PASSWORD */}
					<ListItem>
						<Controller
							name='password'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 6,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='password'
									label='Password'
									inputProps={{ type: 'password' }}
									error={Boolean(errors.password)}
									helperText={
										errors.password
											? errors.password.type ===
											  'minLength'
												? 'Password length is more than 5'
												: 'Password is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					{/* CONFIRM PASSWORD */}
					<ListItem>
						<Controller
							name='confirmPassword'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 6,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='confirmPassword'
									label='Confirm Password'
									inputProps={{ type: 'password' }}
									error={Boolean(errors.confirmPassword)}
									helperText={
										errors.confirmPassword
											? errors.confirmPassword.type ===
											  'minLength'
												? 'Confirm Password length is more than 5'
												: 'Confirm  Password is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					{/* SUBMIT BUTTON */}
					<ListItem>
						<Button
							variant='contained'
							type='submit'
							fullWidth
							color='primary'>
							Register
						</Button>
					</ListItem>
					<ListItem>
						Already have an account? &nbsp;
						<NextLink
							href={`/login?redirect=${redirect || '/'}`}
							passHref>
							<Link>Login</Link>
						</NextLink>
					</ListItem>
				</List>
			</form>
		</Layout>
	)
}
