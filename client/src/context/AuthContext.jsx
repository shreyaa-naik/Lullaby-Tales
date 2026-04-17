import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedStories, setSavedStories] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                        headers: { 'x-auth-token': token }
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                        setSavedStories(data.savedStories || []);
                        fetchNotifications();
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

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/notifications`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (err) {}
    };

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        fetchNotifications();
    };

    const logout = () => {
        setUser(null);
        setSavedStories([]);
        setNotifications([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const saveStory = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/stories/${storyId}/save`, {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                // Refresh local saved list
                const savedRes = await fetch(`${API_BASE_URL}/api/auth/saved`, {
                    headers: { 'x-auth-token': token }
                });
                const data = await savedRes.json();
                setSavedStories(data);
            }
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const unsaveStory = async (storyId) => {
        await saveStory(storyId);
    };

    return (
        <AuthContext.Provider value={{ 
            user, loading, login, logout, 
            savedStories, saveStory, unsaveStory, 
            notifications, fetchNotifications 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
