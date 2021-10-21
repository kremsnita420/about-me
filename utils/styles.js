import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#2A2D43',
        '& a': {
            color: '#F9D3C8',
            marginLeft: 10,
            marginRight: 10,
        },

    },
    navbarButton: {
        color: '#F9D3C8',
        textTransform: 'initial',
    },
    transparentBg: {
        backgroundColor: 'transparnet'
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
        width: '100%',
    },
    fullWidth: {
        width: '100%',
    }
},
    { index: 1 });
export default useStyles