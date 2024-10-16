import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAmazonProduct } from '../../redux/amazonReducer'; // Import the thunk
import { addNewPost } from '../../redux/postsReducer';
import axios from 'axios';

function AffiliateLinkForm() {
	const [affiliateLink, setAffiliateLink] = useState('');
	const dispatch = useDispatch();

	const { productDetails, status, error } = useSelector(
		(state) => state.amazon
	);
	const { status: postStatus, error: postError } = useSelector(
		(state) => state.posts
	);

	// Function to expand shortened URLs
	const expandShortenedLink = async (shortUrl) => {
		try {
			const response = await axios.get(`http://localhost:5000/expand-url`, {
				params: { url: shortUrl },
			});
			return response.data.finalUrl;
		} catch (error) {
			console.error('Error expanding shortened URL:', error);
			return shortUrl;
		}
	};

	const handleFetchProductDetails = async () => {
		const expandedLink = await expandShortenedLink(affiliateLink);
		console.log('Expanded Link:', expandedLink);
		dispatch(fetchAmazonProduct(expandedLink));
	};

	const handlePostSubmit = async (e) => {
		e.preventDefault();

		const newPost = {
			title: productDetails.title,
			description: productDetails.description,
			link: affiliateLink,
			user_id: supabase.auth.user().id,
		};

		dispatch(addNewPost(newPost));
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
				disabled={status === 'loading'}
			>
				{status === 'loading' ? 'Fetching...' : 'Get Link'}
			</button>

			{error && <p style={{ color: 'red' }}>{error}</p>}

			{productDetails && productDetails.title && (
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
							value={affiliateLink}
							onChange={(e) =>
								setProductDetails({ ...productDetails, link: affiliateLink })
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
