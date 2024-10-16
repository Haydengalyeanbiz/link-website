import axios from 'axios';
import crypto from 'crypto';
import { parseStringPromise } from 'xml2js';

// Helper function to generate the current timestamp in ISO 8601 format
const getTimestamp = () => {
	return new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
};

// Helper function to sign the API request
const signRequest = (params, secretKey) => {
	// Sort the parameters alphabetically by key
	const sortedParams = Object.keys(params)
		.sort()
		.map((key) => {
			return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
		})
		.join('&');

	// Create the string to sign
	const stringToSign = `GET\nwebservices.amazon.com\n/onca/xml\n${sortedParams}`;

	// Generate the HMAC signature using the secret key
	const signature = crypto
		.createHmac('sha256', secretKey)
		.update(stringToSign)
		.digest('base64');

	return encodeURIComponent(signature);
};

export const getAmazonProductDetails = async (asin) => {
	const accessKey = process.env.VITE_AMAZON_ACCESS_KEY;
	const secretKey = process.env.VITE_AMAZON_SECRET_KEY;
	const associateTag = process.env.VITE_AMAZON_ASSOCIATE_TAG;
	const timestamp = getTimestamp();

	// Parameters required by the Product Advertising API
	const params = {
		Service: 'AWSECommerceService',
		Operation: 'ItemLookup',
		AWSAccessKeyId: accessKey,
		AssociateTag: associateTag,
		ItemId: asin,
		ResponseGroup: 'Images,ItemAttributes',
		Timestamp: timestamp,
	};

	// Sign the request
	const signature = signRequest(params, secretKey);

	// Add the signature to the parameters
	const signedParams = {
		...params,
		Signature: signature,
	};

	try {
		// Make the API request
		const response = await axios.get(
			'https://webservices.amazon.com/onca/xml',
			{
				params: signedParams,
			}
		);

		// Parse the XML response (using an XML parser library would be ideal here)
		const productData = parseAmazonResponse(response.data); // Assuming parseAmazonResponse parses the XML correctly

		return {
			title: productData.title,
			description: productData.description || 'No description available',
			image: productData.imageUrl,
		};
	} catch (error) {
		console.error('Error fetching product details:', error);
		throw error;
	}
};

// Mock function to parse XML (You can use an actual parser like `xml2js` or similar)
const parseAmazonResponse = async (xmlResponse) => {
	try {
		const result = await parseStringPromise(xmlResponse);
		const item = result.ItemLookupResponse.Items[0].Item[0]; // Adjust based on actual structure
		return {
			title: item.ItemAttributes[0].Title[0],
			description: item.ItemAttributes[0].Feature
				? item.ItemAttributes[0].Feature.join(', ')
				: 'No description available',
			imageUrl: item.LargeImage[0].URL[0],
		};
	} catch (error) {
		console.error('Error parsing Amazon XML response:', error);
		throw error;
	}
};
