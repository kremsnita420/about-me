import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { Store } from '../utils/StoreProvider'

export default function Shipping() {
	const router = useRouter()
	//fetch from store provider
	const { state } = useContext(Store)
	const { userInfo } = state
	//after login redirect back to shipping
	if (!userInfo) {
		router.push('/login?redirect=/shipping')
	}

	return <div>Shipping</div>
}
