import { getAmazonProductDetails } from './amazonAPI';

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

//? Thunk for Fetching Product Details
export const fetchAmazonProduct = (affiliateLink) => async (dispatch) => {
	const productId = extractASINFromLink(affiliateLink);

	if (!productId) {
		return dispatch(
			fetchAmazonProductRejected('Invalid Amazon link. Could not extract ASIN.')
		);
	}

	dispatch(fetchAmazonProductPending());

	try {
		const product = await getAmazonProductDetails(productId);
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

//? Helper Function to Extract ASIN
const extractASINFromLink = (url) => {
	const asinMatch = url.match(/(?:dp|gp\/product|ASIN)\/([A-Z0-9]{10})/i);
	if (asinMatch) {
		console.log('Extracted ASIN:', asinMatch[1]);
	} else {
		console.warn('Failed to extract ASIN from URL:', url);
	}
	return asinMatch ? asinMatch[1] : null;
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
				error:
					action.payload || 'An error occurred while fetching product details.',
			};
		default:
			return state;
	}
};

export default amazonReducer;
