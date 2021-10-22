import React, { useContext, useState, useEffect } from 'react'
import NextLink from 'next/link'
import useStyles from '../utils/styles'
import { Store } from '../utils/StoreProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { getError } from '../utils/error'
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
	Box,
	List,
	Drawer,
	Divider,
	ListItemText,
	ListItem,
	InputBase,
} from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import MenuIcon from '@material-ui/icons/Menu'
import CancelIcon from '@material-ui/icons/Cancel'
import SearchIcon from '@material-ui/icons/Search'
import { useSnackbar } from 'notistack'
import axios from 'axios'

function Navbar() {
	//fetch from store provider
	const { state, dispatch } = useContext(Store)
	const { darkMode, cart, userInfo } = state
	const [darkModeState, setDarkModeState] = useState(false)
	const classes = useStyles()
	const [anchorEl, setAnchorEl] = useState(null)
	const router = useRouter()
	const [sidbarVisible, setSidebarVisible] = useState(false)
	const [categories, setCategories] = useState([])
	const { enqueueSnackbar } = useSnackbar()
	const [query, setQuery] = useState('')

	//search and query submit handler
	const queryChangeHandler = (e) => {
		setQuery(e.target.value)
	}
	const submitHandler = (e) => {
		e.preventDefault()
		router.push(`/search?query=${query}`)
	}

	//fetch categories
	const fetchCategories = async () => {
		try {
			const { data } = await axios.get(`/api/products/categories`)
			setCategories(data)
		} catch (err) {
			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}
	useEffect(() => {
		fetchCategories()
	}, [])

	//open-close sidebar handler
	const sidebarOpenHandler = () => {
		setSidebarVisible(true)
	}
	const sidebarCloseHandler = () => {
		setSidebarVisible(false)
	}

	//Logout handler
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

	//darkmode handler
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
			<Toolbar className={classes.toolbar}>
				<Box display='flex' alignItems='center'>
					<IconButton
						edge='start'
						aria-label='open drawer'
						onClick={sidebarOpenHandler}
						className={classes.menuButton}>
						<MenuIcon className={classes.navbarButton} />
					</IconButton>
					<NextLink href='/' passHref>
						<Link>
							<Typography className={classes.brand}>About*me</Typography>
						</Link>
					</NextLink>
				</Box>

				<Drawer
					anchor='left'
					open={sidbarVisible}
					onClose={sidebarCloseHandler}>
					<List>
						<ListItem>
							<Box
								display='flex'
								alignItems='center'
								justifyContent='space-between'>
								<Typography>Shopping by category</Typography>
								<IconButton aria-label='close' onClick={sidebarCloseHandler}>
									<CancelIcon />
								</IconButton>
							</Box>
						</ListItem>
						<Divider light />
						{categories.map((category) => (
							<NextLink
								key={category}
								href={`/search?category=${category}`}
								passHref>
								<ListItem button component='a' onClick={sidebarCloseHandler}>
									<ListItemText primary={category} />
								</ListItem>
							</NextLink>
						))}
					</List>
				</Drawer>

				<div className={classes.searchSection}>
					<form onSubmit={submitHandler} className={classes.searchForm}>
						<InputBase
							name='query'
							className={classes.searchInput}
							placeholder='Search products'
							onChange={queryChangeHandler}
						/>
						{query ? (
							<IconButton
								type='submit'
								className={classes.iconButton}
								aria-label='search'>
								<SearchIcon />
							</IconButton>
						) : (
							<IconButton
								type='submit'
								disabled
								className={classes.iconButton}
								aria-label='search'>
								<SearchIcon />
							</IconButton>
						)}
					</form>
				</div>

				<div>
					<IconButton onClick={darkModeChangeHandler} color='inherit'>
						{darkModeState ? (
							<WbSunnyIcon className={classes.navbarButton} />
						) : (
							<Brightness2Icon className={classes.navbarButton} />
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
							<Link>
								<Typography component='span'>Login</Typography>
							</Link>
						</NextLink>
					)}
					{/* <Switch checked={darkModeState} onChange={darkModeChangeHandler} /> */}
				</div>
			</Toolbar>
		</AppBar>
	)
}

// MAKE CART RENDER ON CLIENTSIDE
export default dynamic(() => Promise.resolve(Navbar), { ssr: false })
