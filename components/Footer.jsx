import { Typography } from '@material-ui/core'
import useStyles from '../utils/styles'

export default function Footer() {
	const classes = useStyles()

	return (
		<footer className={classes.footer}>
			<Typography variant='h5'>
				All rights reserved &copy; {new Date().getFullYear()}. Next
				About*me.
			</Typography>
		</footer>
	)
}
