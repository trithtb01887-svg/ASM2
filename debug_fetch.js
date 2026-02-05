
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

async function testGetPosts() {
    const page = 1;
    const limit = 6;
    const url = `/posts?_page=${page}&_limit=${limit}&_sort=created_at&_order=desc`;

    console.log(`Fetching: ${url}`);

    try {
        const response = await api.get(url);
        console.log('Response Status:', response.status);
        console.log('Response Keys:', Object.keys(response.data));

        if (response.data.data) {
            console.log('response.data.data is Array?', Array.isArray(response.data.data));
            console.log('response.data.data length:', response.data.data.length);
            if (response.data.data.length > 0) {
                console.log('First item ID:', response.data.data[0].id);
            }
        } else {
            console.log('response.data.data is UNDEFINED');
            console.log('response.data is Array?', Array.isArray(response.data));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testGetPosts();
