import axios from 'axios';
import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const red = await axiosInstance.get('/auth/check');
            set({ authUser: red.data });
            get().connectSocket();
        } catch (error) {
            console.error('Error checking auth:', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post('/auth/signup', formData);
            toast.success("Account created successfully!");
            set({ authUser: response.data, isSigningUp: false });
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create account");
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to log out");
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/auth/login', formData);
            set({ authUser: response.data, isLoggingIn: false });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to log in");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: response.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return; 
        const socket = io(BASE_URL, {
            query: { userId: authUser._id },
        });
        socket.connect();
        set({ socket });
        socket.on("online-users", (users) => {
            set({ onlineUsers: users });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
