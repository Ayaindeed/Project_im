import api from './api';

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Dispatch un événement personnalisé pour signaler la connexion
            const loginEvent = new CustomEvent('userLogin', { 
                detail: { user: response.data.user } 
            });
            window.dispatchEvent(loginEvent);
        }
        
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const registerAdmin = async (adminData) => {
    try {
        const response = await api.post('/auth/admin/register', {
            nom: adminData.nom,
            prenom: adminData.prenom,
            email: adminData.email,
            motdepasse: adminData.motdepasse
        });

        return response.data;
    } catch (error) {
        console.error('Admin registration error:', error);
        throw error;
    }
};

export const updateProfile = async (formData) => {
    try {
        const response = await api.put('/auth/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

export const authService = {
    loginUser,
    registerUser,
    registerAdmin,
    updateProfile
};