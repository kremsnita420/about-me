import {
	List,
	ListItem,
	Typography,
	TextField,
	Button,
	Link,
} from '@material-ui/core'
import NextLink from 'next/link'
import React from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'

export default function Register() {
	const classes = useStyles()

	return (
		<Layout title='Register'>
			<form className={classes.form}>
				<Typography component='h1' variant='h1'>
					Register
				</Typography>
				<List>
					<ListItem>
						<TextField
							variant='outlined'
							fullWidth
							id='name'
							label='Name'
							inputProps={{ type: 'name' }}
						/>
					</ListItem>
					<ListItem>
						<TextField
							variant='outlined'
							fullWidth
							id='email'
							label='Email'
							inputProps={{ type: 'email' }}
						/>
					</ListItem>
					<ListItem>
						<TextField
							variant='outlined'
							fullWidth
							id='password'
							label='Password'
							inputProps={{ type: 'password' }}
						/>
					</ListItem>
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
						<NextLink href='/login' passHref>
							<Link>Login</Link>
						</NextLink>
					</ListItem>
				</List>
			</form>
		</Layout>
	)
}
