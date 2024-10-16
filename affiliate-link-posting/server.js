const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS

app.get('/expand-url', async (req, res) => {
	const { url } = req.query;
	try {
		const response = await axios.get(url);
		const finalUrl = response.request.res.responseUrl || url;
		res.json({ finalUrl });
	} catch (error) {
		console.error('Error in expand-url route:', error.message);
		res.status(500).send(`Error expanding URL: ${error.message}`);
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
