import React, { useContext, useState, useEffect } from 'react'
import NextLink from 'next/link'
import useStyles from '../utils/styles'
import { Store } from '../utils/StoreProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import {
	AppBar,
	Toolbar,
	Typography,
	Link,
	Badge,
	Button,
	Menu,
	MenuItem,
	IconButton,
} from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness5Icon from '@material-ui/icons/Brightness5'

function Navbar() {
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

	const loginMenuCloseHandler = (e, redirect) => {
		setAnchorEl(null)
		if (redirect) {
			router.push(redirect)
		}
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

	return (
		<AppBar position='static' className={classes.navbar}>
			<Toolbar>
				<NextLink href='/' passHref>
					<Link>
						<Typography className={classes.brand}>About*me</Typography>
					</Link>
				</NextLink>
				<div className={classes.grow}></div>
				<div>
					{/* <Switch checked={darkModeState} onChange={darkModeChangeHandler} /> */}
					<IconButton onClick={darkModeChangeHandler} color='inherit'>
						{darkModeState ? (
							<Brightness4Icon className={classes.navbarButton} />
						) : (
							<Brightness5Icon className={classes.navbarButton} />
						)}
					</IconButton>
					<NextLink href='/cart' passHref>
						<Link>
							<Typography component='span'>
								{cart.cartItems.length > 0 ? (
									<Badge
										color='primary'
										size='small'
										badgeContent={cart.cartItems.length}>
										<ShoppingCartIcon fontSize='medium' />
									</Badge>
								) : (
									<Badge color='default' badgeContent=' '>
										<ShoppingCartIcon fontSize='medium' />
									</Badge>
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
								<AccountCircleIcon fontSize='medium'>
									{userInfo.name}
								</AccountCircleIcon>
							</Button>
							<Menu
								id='simple-menu'
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={loginMenuCloseHandler}>
								<MenuItem onClick={(e) => loginMenuCloseHandler(e, '/profile')}>
									Profile
								</MenuItem>
								<MenuItem onClick={(e) => loginMenuCloseHandler(e, '/history')}>
									Order History
								</MenuItem>
								<MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
								{userInfo.isAdmin && (
									<MenuItem
										onClick={(e) =>
											loginMenuCloseHandler(e, '/admin/dashboard')
										}>
										Admin Dashboard
									</MenuItem>
								)}
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
	)
}

// MAKE CART RENDER ON CLIENTSIDE
export default dynamic(() => Promise.resolve(Navbar), { ssr: false })
