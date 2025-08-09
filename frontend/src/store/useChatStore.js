import {create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import { useAuthStore } from './useAuthStore';


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUsser: null,
    isUserLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const response = await axiosInstance.get('/messages/users');
            console.log(response.data);
            set({ users: response.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
            set({ isUserLoading: false });
        } finally {
            set({ isUserLoading: false });
        }
    },


    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data});
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (data) => {
        const {selectedUser, messages } = get();

        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);
            set({ messages: [...messages, response.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on('new-message', (message) => {
            if (message.senderId !== selectedUser._id) return;
            // Only update messages if the new message is from the selected user
            set({ messages: [...get().messages, message] });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('new-message');
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },
}));