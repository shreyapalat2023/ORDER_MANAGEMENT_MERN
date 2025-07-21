import { useState,useEffect } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import { Outlet } from "react-router-dom";

const AdminRoute = () => {
    const [auth] = useAuth();
    const [ok,setOk] = useState(false);

    useEffect(() => {
        const adminCheck = async () => {
            try {
                const {data} = await axios.get("/admin-check",{
                    headers:{
                        Authorization:auth?.token,
                    }
                })
                if(data.ok){
                    setOk(true);
                } else{
                    setOk(false);
                }
                
            } catch (error) {
                 console.log("Admin check failed:", error);
                setOk(false);
                
            }
        };
         if (auth?.token) {
            adminCheck();
        }
    },[auth?.token]);
    return ok ? <Outlet/> : "loading..."
}

export default AdminRoute;