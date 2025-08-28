import Sidebar from "../components/Sidebar/Sidebar.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-gray-100 min-h-screen p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
