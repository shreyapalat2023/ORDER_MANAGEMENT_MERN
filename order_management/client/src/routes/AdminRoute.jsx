import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Loading from "../components/loading/LoadingCompo.jsx";

const AdminRoute = () => {
    const [auth] = useAuth();
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminCheck = async () => {
            try {
                const { data } = await axios.get("/admin-check", {
                    headers: {
                        Authorization: auth?.token,
                    },
                });
                if (data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                console.log("Admin check failed:", error);
                setOk(false);
            } finally {
                setLoading(false);
            }
        };

        if (auth?.token) {
            adminCheck();
        } else {
            setLoading(false);
        }
    }, [auth?.token]);


    if (loading) {
        return (
           <Loading/>

        );
    }

    return ok ? <Outlet /> : <div className="text-center mt-10 text-red-500">Access denied</div>;
};

export default AdminRoute;
