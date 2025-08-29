import axios from 'axios';

const API_URL = 'https://eams-13ws.vercel.app/api/auth'; // Ensure this matches the backend URL


const AuthService = {
    register: async (userData: { name: string; email: string; password: string; role: string }) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData, {
                headers: { "Content-Type": "application/json" }
            });
            
            console.log("✅ Registration API Response:", response.data);
            
            // Store the token and user data
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error("❌ Registration Error:", error);
            throw error;
        }
    },

    login: async (userData: { email: string; password: string }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, userData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
    
            console.log("✅ Login API Response - Complete Data:", {
                ...response.data,
                user: {
                    ...response.data.user,
                    hasPosition: !!response.data.user.position,
                    hasDepartment: !!response.data.user.department,
                    hasJoinDate: !!response.data.user.joinDate
                }
            });
    
            // Store token and complete user data
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify({
                ...response.data.user,
                position: response.data.user.position,
                department: response.data.user.department,
                joinDate: response.data.user.joinDate
            }));
    
            return response.data;
        } catch (error) {
            console.error("❌ Axios login error:", error);
            throw error;
        }
    },
    logout: async () => { 
        try {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            localStorage.removeItem("token");
        } catch (error) {
            console.error("❌ Axios logout error:", error);
            throw error;
        }
    },

    getToken: () => { 
        return localStorage.getItem("token");
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    }
};

export default AuthService;
