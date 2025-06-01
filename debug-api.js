const axios = require('axios');

// First let's test if we can get a token by logging in
async function testAPI() {
    try {
        console.log('Testing API endpoints...');
        
        // Test login first
        const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'test@company.com', // Replace with actual company email
            motdepasse: 'password123'   // Replace with actual password
        });
        
        console.log('Login successful:', loginResponse.data);
        const token = loginResponse.data.accessToken;
        
        // Test getting stages with token
        const stagesResponse = await axios.get('http://localhost:8080/api/entreprise/stages', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Stages data:', JSON.stringify(stagesResponse.data, null, 2));
        
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
    }
}

testAPI();
