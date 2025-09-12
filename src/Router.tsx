import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './sections/layout/Layout';
import { ThemeDetailFactory } from './sections/themeDetail/ThemeDetailFactory';
import { ThemesListFactory } from './sections/themesList/ThemesListFactory';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/themes",
                element: ThemesListFactory.create(),
            },
            {
                path: "/themes/:id",
                element: ThemeDetailFactory.create(),
            }
        ]
    } 
]);

export function Router() {
    return <RouterProvider router={router} />;
}
