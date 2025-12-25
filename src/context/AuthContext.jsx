import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext()
console.log(`${import.meta.env.VITE_API_URL}/api/auth/refresh`)
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios
                    .get(`${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                        {
                            withCredentials: true
                        })
                setAuth({
                    accessToken: res.data.accessToken,
                    role: res.data.user.role,
                    email: res.data.user.email,
                })
            } catch (error) {

                if (error.response?.status !== 401) {
                    console.error("Unexpected auth error:", error);
                }
                setAuth(null)
            } finally {
                setLoading(false)
            }
        }
        checkAuth();
    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
