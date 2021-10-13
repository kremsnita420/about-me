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
	Switch,
	Badge,
	Button,
	Menu,
	MenuItem,
} from '@material-ui/core'

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

	return (
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
										badgeContent={cart.cartItems.length}>
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
								<MenuItem onClick={loginMenuCloseHandler}>
									Profile
								</MenuItem>
								<MenuItem onClick={loginMenuCloseHandler}>
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
	)
}

// MAKE CART RENDER ON CLIENTSIDE
export default dynamic(() => Promise.resolve(Navbar), { ssr: false })
