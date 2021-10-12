import React, { useContext, useState, useEffect } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {
	AppBar,
	Toolbar,
	Typography,
	Container,
	createTheme,
	Link,
	Switch,
	ThemeProvider,
	CssBaseline,
	Badge,
	Button,
	Menu,
	MenuItem,
} from '@material-ui/core'
import useStyles from '../utils/styles'
import { Store } from '../utils/StoreProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export default function Layout({ title, description, children }) {
	//fetch from store provider
	const { state, dispatch } = useContext(Store)
	const { darkMode, cart, userInfo } = state

	const [darkModeState, setDarkModeState] = useState(false)
	const classes = useStyles()
	const [anchorEl, setAnchorEl] = useState(null)
	const router = useRouter()

	const loginClickHandler = (e) => {
		setAnchorEl(e.currentTarget)
	}

	const logoutClickHandler = () => {
		setAnchorEl(null)
		dispatch({ type: 'USER_LOGOUT' })
		Cookies.remove('userInfo')
		Cookies.remove('cartItems')
		router.push('/')
	}

	const loginMenuCloseHandler = () => {
		setAnchorEl(null)
	}

	const darkModeChangeHandler = () => {
		dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })
		const newDarkMode = !darkMode
		setDarkModeState(newDarkMode)
		Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF')
	}

	useEffect(() => {
		setDarkModeState(darkMode)
	}, [darkMode])

	const theme = createTheme({
		typography: {
			h1: {
				fontSize: '1.6rem',
				fontWeight: 400,
				margin: '1rem 0',
			},
			h2: {
				fontSize: '1.4rem',
				fontWeight: 400,
				margin: '1rem 0',
			},
		},
		palette: {
			type: darkMode ? 'dark' : 'light',
			primary: {
				main: '#00E0A8',
			},
			secondary: {
				main: '#5E239D ',
			},
		},
	})

	return (
		<div>
			<Head>
				<title>
					{title ? `${title} - Next About*me` : 'Next About*me'}
				</title>
				{description && (
					<meta name='description' content={description}></meta>
				)}
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppBar position='static' className={classes.navbar}>
					<Toolbar>
						<NextLink href='/' passHref>
							<Link>
								<Typography className={classes.brand}>
									About*me
								</Typography>
							</Link>
						</NextLink>
						<div className={classes.grow}></div>
						<div>
							<Switch
								checked={darkModeState}
								onChange={darkModeChangeHandler}
							/>
							<NextLink href='/cart' passHref>
								<Link>
									<Typography component='span'>
										{cart.cartItems.length > 0 ? (
											<Badge
												color='secondary'
												badgeContent={
													cart.cartItems.length
												}>
												Cart
											</Badge>
										) : (
											'Cart'
										)}
									</Typography>
								</Link>
							</NextLink>
							{userInfo ? (
								<>
									<Button
										aria-controls='simple-menu'
										aria-haspopup='true'
										onClick={loginClickHandler}
										className={classes.navbarButton}>
										{userInfo.name}
									</Button>
									<Menu
										id='simple-menu'
										anchorEl={anchorEl}
										keepMounted
										open={Boolean(anchorEl)}
										onClose={loginMenuCloseHandler}>
										<MenuItem
											onClick={loginMenuCloseHandler}>
											Profile
										</MenuItem>
										<MenuItem
											onClick={loginMenuCloseHandler}>
											My account
										</MenuItem>
										<MenuItem onClick={logoutClickHandler}>
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<NextLink href='/login' passHref>
									<Link>Login</Link>
								</NextLink>
							)}
						</div>
					</Toolbar>
				</AppBar>
				<Container className={classes.main}>{children}</Container>
				<footer className={classes.footer}>
					<Typography variant='h5'>
						All rights reserved. Next About*me.
					</Typography>
				</footer>
			</ThemeProvider>
		</div>
	)
}
