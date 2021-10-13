import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#2A2D43',
        '& a': {
            color: '#F9D3C8',
            marginRight: 20,
        },

    },
    navbarButton: {
        color: '#F9D3C8',
        textTransform: 'initial',
    },
    brand: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    grow: {
        flexGrow: 1,
    },
    main: {
        minHeight: `calc(100vh - 135px)`,

    },
    footer: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 30,

    },
    section: {
        marginTop: 10,
        marginBottom: 10,

    },
    form: {
        maxWidth: 600,
        margin: '0 auto',
    },
});
export default useStyles