import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../../redux/postsSlice';

function HomePage() {
	const dispatch = useDispatch();
	const posts = useSelector((state) => state.posts.posts);
	const postStatus = useSelector((state) => state.posts.status);

	useEffect(() => {
		dispatch(fetchPosts());
	}, [dispatch]);

	return (
		<div>
			<h1>Affiliate Links</h1>
			{postStatus === 'loading' ? (
				<p>Loading...</p>
			) : (
				<ul>
					{posts.map((post) => (
						<li key={post.id}>
							<a href={post.link}>{post.title}</a>
							<p>{post.description}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default HomePage;
