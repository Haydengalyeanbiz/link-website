import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../../redux/postsReducer';
import '../HomePage/HomePage.css';

function HomePage() {
	const dispatch = useDispatch();
	const posts = useSelector((state) => state.posts.posts);
	const postStatus = useSelector((state) => state.posts.status);

	useEffect(() => {
		dispatch(fetchPosts());
	}, [dispatch]);

	return (
		<div className='posts-container'>
			{posts.length === 0 ? (
				<p>There are no posts yet...</p>
			) : (
				<div>posts.map goes here</div>
			)}
		</div>
	);
}

export default HomePage;
