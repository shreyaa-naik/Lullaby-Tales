import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedStories, setSavedStories] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            const bookmarks = localStorage.getItem('savedStories');

            if (token && savedUser) {
                try {
                    // Quick profile check to verify token validity
                    const res = await fetch('http://localhost:5000/api/auth/profile', {
                        headers: { 'x-auth-token': token }
                    });
                    
                    if (res.ok) {
                        setUser(JSON.parse(savedUser));
                    } else if (res.status === 401) {
                        // Secret changed or token invalid - clear it
                        logout();
                    }
                } catch (err) {
                    console.error("Auth check failed", err);
                }
            }

            if (bookmarks) {
                setSavedStories(JSON.parse(bookmarks));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const saveStory = (story) => {
        const newSaved = [...savedStories, story];
        setSavedStories(newSaved);
        localStorage.setItem('savedStories', JSON.stringify(newSaved));
    };

    const unsaveStory = (storyId) => {
        const newSaved = savedStories.filter(s => (s.id || s._id) !== storyId);
        setSavedStories(newSaved);
        localStorage.setItem('savedStories', JSON.stringify(newSaved));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, savedStories, saveStory, unsaveStory }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
