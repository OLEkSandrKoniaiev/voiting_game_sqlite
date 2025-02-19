import {createRoot} from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import {router} from "./router.tsx";
import './index.css'
import {jokesService} from "./services/jokes.service.ts";

jokesService.getJoke().then();

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
