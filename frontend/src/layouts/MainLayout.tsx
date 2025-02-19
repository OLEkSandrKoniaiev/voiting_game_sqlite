import {Outlet} from "react-router-dom";

export const MainLayout = () => {
    return (
        <div className="flex justify-center items-start h-screen bg-white dark:bg-gray-800">
            <Outlet/>
        </div>
    );
};
