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
				light: '#7986cb',
				main: '#3f51b5',
				dark: '#303f9f',
				contrastText: '#fefefe',
			},
			secondary: {
				light: '#ff4081',
				main: '#f50057',
				dark: '#c51162',
				contrastText: '#fefefe',
			},
		},
	})

	return (
		<div>
			<Head>
				<title>{title ? `${title} - Next About*me` : 'Next About*me'}</title>
				{description && <meta name='description' content={description}></meta>}
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
