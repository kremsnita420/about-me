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
import { getError } from '../utils/error'

export default function Login() {
	//reacthookform
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm()
	//snackbar notifications
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const router = useRouter()

	const { redirect } = router.query
	const classes = useStyles()

	//fetch from store provider
	const { state, dispatch } = useContext(Store)
	const { userInfo } = state

	useEffect(() => {
		if (userInfo) {
			router.push(redirect || '/')
		}
	}, [redirect, userInfo, router])

	//login submit handler
	const submitHandler = async ({ email, password }) => {
		closeSnackbar()
		//make a request to database
		try {
			const { data } = await axios.post('/api/users/login', {
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
			//snackbar notification
			enqueueSnackbar(getError(error), { variant: 'error' })
		}
	}

	return (
		<Layout title='Login'>
			{/* FORM START */}
			<form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
				<Typography component='h1' variant='h1'>
					Login
				</Typography>
				<List>
					{/* EMAIL */}
					<ListItem>
						<Controller
							name='email'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
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
											? errors.password.type === 'minLength'
												? 'Password length is more than 5'
												: 'Password is required'
											: ''
									}
									{...field}
								/>
							)}
						/>
					</ListItem>
					{/* SUBMIT BUTTON */}
					<ListItem>
						<Button variant='contained' type='submit' fullWidth color='primary'>
							Login
						</Button>
					</ListItem>
					<ListItem>
						Don&apos;t have an account? &nbsp;
						<NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
							<Link>Register</Link>
						</NextLink>
					</ListItem>
				</List>
			</form>
		</Layout>
	)
}
