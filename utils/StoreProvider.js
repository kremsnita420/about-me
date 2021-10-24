import Cookies from 'js-cookie'
import { createContext, useReducer } from 'react'

export const Store = createContext()

const initialState = {
    darkMode: Cookies.get('darkMode') === 'ON'
        ? true
        : false,

    cart: {
        cartItems: Cookies.get('cartItems')
            ? JSON.parse(Cookies.get('cartItems'))
            : [],
        shippingAddress: Cookies.get('shippingAddress')
            ? JSON.parse(Cookies.get('shippingAddress'))
            : {},
        paymentMethod: Cookies.get('paymentMethod')
            ? Cookies.get('paymentMethod')
            : '',
    },
    wishList: {
        wishListItems: Cookies.get('wishListItems')
            ? JSON.parse(Cookies.get('wishListItems'))
            : [],
    },
    userInfo: Cookies.get('userInfo')
        ? JSON.parse(Cookies.get('userInfo'))
        : null,
}

function reducer(state, action) {
    switch (action.type) {
        case 'DARK_MODE_ON':
            return { ...state, darkMode: true }
        case 'DARK_MODE_OFF':
            return { ...state, darkMode: false }

        case 'WISHLIST_ADD_ITEM': {
            const newListItem = action.payload
            //check if its already on wishlist
            const existListItem = state.wishList.wishListItems.find(
                (item) => item._id === newListItem._id
            )
            //new value for wishlist 
            const wishListItems = existListItem
                ? state.wishList.wishListItems.map((item) =>
                    item._id === existListItem._id ? newListItem : item
                )
                : [...state.wishList.wishListItems, newListItem]

            //save wishlist items to cookie
            Cookies.set('wishListItems', JSON.stringify(wishListItems))
            return { ...state, wishList: { ...state.wishList, wishListItems } }
        }

        case 'CART_ADD_ITEM': {
            const newItem = action.payload
            //check if item is already in cart
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            )
            //new value for cart items
            const cartItems = existItem
                ? state.cart.cartItems.map((item) =>
                    item._id === existItem._id ? newItem : item
                )
                : [...state.cart.cartItems, newItem]
            //save cart items to cookie
            Cookies.set('cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems } }
        }

        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            )
            //remove cart items from cookie
            Cookies.set('cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems } }
        }
        case 'CART_CLEAR': {
            return { ...state, cart: { ...state.cart, cartItems: [] } }
        }
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                cart: { ...state.cart, shippingAddress: action.payload },
            }
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            }
        case 'USER_LOGIN': {
            return { ...state, userInfo: action.payload }
        }
        case 'USER_LOGOUT': {
            return {
                ...state,
                userInfo: null,
                cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' }
            }
        }
        default:
            return state
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch }
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}