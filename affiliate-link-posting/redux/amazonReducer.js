// ? --------- ACTIONS -----------
export const FETCH_AMAZON_PRODUCT_PENDING = 'FETCH_AMAZON_PRODUCT_PENDING';
export const FETCH_AMAZON_PRODUCT_FULFILLED = 'FETCH_AMAZON_PRODUCT_FULFILLED';
export const FETCH_AMAZON_PRODUCT_REJECTED = 'FETCH_AMAZON_PRODUCT_REJECTED';

// ? --------- ACTION CREATORS -----------
export const fetchAmazonProductPending = () => ({
	type: FETCH_AMAZON_PRODUCT_PENDING,
});

export const fetchAmazonProductFulfilled = (product) => ({
	type: FETCH_AMAZON_PRODUCT_FULFILLED,
	payload: product,
});

export const fetchAmazonProductRejected = (error) => ({
	type: FETCH_AMAZON_PRODUCT_REJECTED,
	payload: error,
});

// ! --------- THUNKS -----------

export const fetchAmazonProduct = (affiliateLink) => async (dispatch) => {
	const apiKey = import.meta.env.VITE_RAINFOREST_API_KEY;
	const productId = extractProductIdFromLink(affiliateLink);

	if (!productId) {
		return dispatch(
			fetchAmazonProductRejected('Invalid Amazon link. Could not extract ASIN.')
		);
	}

	dispatch(fetchAmazonProductPending());

	try {
		const response = await axios.get('https://api.rainforestapi.com/request', {
			params: {
				api_key: apiKey,
				type: 'product',
				amazon_domain: 'amazon.com',
				asin: productId,
			},
		});

		const product = response.data.product;

		dispatch(
			fetchAmazonProductFulfilled({
				title: product.title,
				description: product.description || product.features.join(', '),
				link: affiliateLink,
			})
		);
	} catch (error) {
		dispatch(fetchAmazonProductRejected(error.message));
	}
};

// ! ---------- INITIAL STATE --------------
const initialState = {
	productDetails: null,
	status: 'idle',
	error: null,
};

// ! ---------- AMAZON REDUCER --------------
export const amazonReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_AMAZON_PRODUCT_PENDING:
			return {
				...state,
				status: 'loading',
				error: null,
			};
		case FETCH_AMAZON_PRODUCT_FULFILLED:
			return {
				...state,
				status: 'succeeded',
				productDetails: action.payload,
			};
		case FETCH_AMAZON_PRODUCT_REJECTED:
			return {
				...state,
				status: 'failed',
				error: action.payload,
			};
		default:
			return state;
	}
};

export default amazonReducer;
