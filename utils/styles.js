import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#2A2D43',
        '& a': {
            color: '#F9D3C8',
            marginRight: 20,
        },

    },
    brand: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    grow: {
        flexGrow: 1,
    },
    main: {
        minHeight: '80vh',
    },
    footer: {
        marginTop: 10,
        textAlign: 'center',
    },
    section: {
        marginTop: 10,
        marginBottom: 10,
    },
});
export default useStyles