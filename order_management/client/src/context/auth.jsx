import {useEffect, useContext, createContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    })

    //axios config
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parsed = JSON.parse(data);
            setAuth({ ...auth, user: parsed.user, token: parsed.token });
        }
    }, [])
    return <>
        <AuthContext.Provider value={[auth, setAuth]}>{children}</AuthContext.Provider>
    </>
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider }