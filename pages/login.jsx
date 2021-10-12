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
import React, { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import { Store } from '../utils/StoreProvider'
import useStyles from '../utils/styles'

export default function Login() {
	const router = useRouter()
	//login?redirect=/shipping
	const redirect = router.query
	const classes = useStyles()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	//fetch from store provider
	const { state, dispatch } = useContext(Store)
	const { userInfo } = state

	useEffect(() => {
		if (userInfo) {
			router.push('/')
		}
	}, [userInfo, router])

	//login submit handler
	const submitHandler = async (e) => {
		e.preventDefault()
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
			alert(
				error.response.data
					? error.response.data.message
					: error.message
			)
		}
	}

	return (
		<Layout title='Login'>
			<form onSubmit={submitHandler} className={classes.form}>
				<Typography component='h1' variant='h1'>
					Login
				</Typography>
				<List>
					<ListItem>
						<TextField
							variant='outlined'
							fullWidth
							id='email'
							label='Email'
							inputProps={{ type: 'email' }}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</ListItem>
					<ListItem>
						<TextField
							variant='outlined'
							fullWidth
							id='password'
							label='Password'
							inputProps={{ type: 'password' }}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</ListItem>
					<ListItem>
						<Button
							variant='contained'
							type='submit'
							fullWidth
							color='primary'>
							Login
						</Button>
					</ListItem>
					<ListItem>
						Dont have an account? &nbsp;
						<NextLink href='/register' passHref>
							<Link>Register</Link>
						</NextLink>
					</ListItem>
				</List>
			</form>
		</Layout>
	)
}
