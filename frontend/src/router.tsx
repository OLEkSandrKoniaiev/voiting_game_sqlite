import {createBrowserRouter, Navigate} from "react-router-dom";
import {MainLayout} from "./layouts/MainLayout";
import {JokePage} from "./pages/JokePage";
import {JokesPage} from "./pages/JokesPage";

export const router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>, children: [
            {index: true, element: <Navigate to={'joke'}/>},
            {path: 'joke', element: <JokePage/>},
            {path: 'jokes', element: <JokesPage/>}
        ]
    }
])
