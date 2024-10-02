import { useState } from 'react';
import { supabase } from '../../supabaseClient';

function AffiliateLinkForm() {
	const [affiliateLink, setAffiliateLink] = useState('');
	const [productDetails, setProductDetails] = useState({
		title: '',
		description: '',
		link: '',
	});
	const [loading, setLoading] = useState(false);

	const handleFetchProductDetails = async () => {
		setLoading(true);
		try {
			// Replace this with actual logic to fetch data from Amazon API
			const response = await fetchAmazonProduct(affiliateLink); // Mock function for now
			if (response) {
				setProductDetails({
					title: response.title,
					description: response.description,
					link: affiliateLink,
				});
			}
		} catch (error) {
			console.error('Error fetching product details: ', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchAmazonProduct = async (url) => {
		// Placeholder for Amazon API request
		// You need to configure access to Amazon API using AWS SDK or other methods.
		// Simulating response for now:
		return {
			title: 'Amazon Product Title',
			description: 'Amazon product description',
			link: url,
		};
	};

	const handlePostSubmit = async (e) => {
		e.preventDefault();
		try {
			// Insert post into the Supabase backend
			const { error } = await supabase.from('posts').insert([
				{
					title: productDetails.title,
					description: productDetails.description,
					link: productDetails.link,
					user_id: supabase.auth.user().id, // Ensure the user is authenticated
				},
			]);
			if (error) throw error;
			alert('Post successfully saved!');
		} catch (error) {
			console.error('Error saving post: ', error);
		}
	};

	return (
		<div>
			<h1>Create Affiliate Post</h1>
			<input
				type='text'
				placeholder='Paste your affiliate link'
				value={affiliateLink}
				onChange={(e) => setAffiliateLink(e.target.value)}
			/>
			<button
				onClick={handleFetchProductDetails}
				disabled={loading}
			>
				{loading ? 'Fetching...' : 'Get Link'}
			</button>

			{productDetails.title && (
				<form onSubmit={handlePostSubmit}>
					<label>
						Title:
						<input
							type='text'
							value={productDetails.title}
							onChange={(e) =>
								setProductDetails({ ...productDetails, title: e.target.value })
							}
						/>
					</label>
					<br />
					<label>
						Description:
						<textarea
							value={productDetails.description}
							onChange={(e) =>
								setProductDetails({
									...productDetails,
									description: e.target.value,
								})
							}
						/>
					</label>
					<br />
					<label>
						Affiliate Link:
						<input
							type='text'
							value={productDetails.link}
							onChange={(e) =>
								setProductDetails({ ...productDetails, link: e.target.value })
							}
						/>
					</label>
					<br />
					<button type='submit'>Create Post</button>
				</form>
			)}
		</div>
	);
}

export default AffiliateLinkForm;
