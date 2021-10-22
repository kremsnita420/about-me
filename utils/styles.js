import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    navbar: {
        background: '#2A2D43',
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
    toolbar: {
        justifyContent: 'space-between',
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
    },
    reviewForm: {
        maxWidth: 800,
        width: '100%',
    },
    reviewItem: {
        marginRight: '1rem',
        borderRight: '1px #808080 solid',
        paddingRight: '1rem',
    },
    menuButton: { padding: 0 },
    // search
    searchSection: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    searchForm: {
        border: '1px solid #fff',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    searchInput: {
        paddingLeft: 5,
        color: '#2A2D43',
        '& ::placeholder': {
            color: '#606060',
        }
    },
    iconButton: {
        backgroundColor: '#264600',
        padding: 5,
        borderRadius: '0 5px 5px 0',
        '& span': {
            color: '#2A2D43',
        },
    },
}),
    { index: 1 });//mui styles have index 0, so custom styles are applied last
export default useStyles