import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedStories, setSavedStories] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                        headers: { 'x-auth-token': token }
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data.user);
                        setSavedStories(data.user.savedStories || []);
                    } else if (res.status === 401) {
                        logout();
                    }
                } catch (err) {
                    console.error("Auth check failed", err);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setSavedStories(userData.savedStories || []);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setSavedStories([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('savedStories');
    };

    const saveStory = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/save/${storyId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setSavedStories(data.savedStories);
            }
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const unsaveStory = async (storyId) => {
        // Same as saveStory because it's a toggle
        await saveStory(storyId);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, savedStories, saveStory, unsaveStory }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
