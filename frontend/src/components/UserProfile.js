import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/userService';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await getUserProfile();
                setUser(userData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async (updatedData) => {
        setLoading(true);
        try {
            const updatedUser = await updateUserProfile(updatedData);
            setUser(updatedUser);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>User Profile</h1>
            {user && (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    {/* Add more user fields as necessary */}
                </div>
            )}
            {/* Add a form or other UI elements to update the user profile */}
        </div>
    );
};

export default UserProfile;