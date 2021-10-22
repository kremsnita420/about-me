import Head from 'next/head'
import {
	Container,
	ThemeProvider,
	CssBaseline,
	createTheme,
} from '@material-ui/core'
import { useContext } from 'react'
import { Store } from '../utils/StoreProvider'
import Navbar from './Navbar'
import useStyles from '../utils/styles'
import Footer from './Footer'

export default function Layout({ title, description, children }) {
	//fetch from store provider
	const { state } = useContext(Store)
	const { darkMode } = state

	const classes = useStyles()

	const theme = createTheme({
		typography: {
			h1: {
				fontSize: '1.6rem',
				fontWeight: 700,
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
				light: '#00BBDE',
				main: '#0062FF',
				dark: '#00D19F',
				contrastText: '#00058C',
			},
			secondary: {
				light: '#B64465',
				main: '#7C0199',
				dark: '#6D1E52',
				contrastText: '#16010A',
			},
		},
	})

	return (
		<div>
			<Head>
				<title>{title ? `${title} - Next About*me` : 'Next About*me'}</title>
				{description && <meta name='description' content={description} />}
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />

				<Navbar />

				<Container className={classes.main}>{children}</Container>

				<Footer />
			</ThemeProvider>
		</div>
	)
}
