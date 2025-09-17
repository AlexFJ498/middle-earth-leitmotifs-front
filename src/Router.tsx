import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AboutFactory } from './sections/about/AboutFactory';
import { Layout } from './sections/layout/Layout';
import { ThemeDetailFactory } from './sections/themeDetail/ThemeDetailFactory';
import { ThemesListFactory } from './sections/themesList/ThemesListFactory';
import { GroupDetailFactory } from './sections/groupDetail/GroupDetailFactory';
import { ThemeEditor } from './sections/dev/ThemeEditor';

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
            },
			{
				path: "/groups/:groupId",
				element: GroupDetailFactory.create(),
			},
            {
                path: "/about",
                element: AboutFactory.create(),
            },
            {
                path: "/dev/theme",
                // Ruta solo para desarrollo
                element: <ThemeEditor />,
            }
        ]
    } 
]);

export function Router() {
    return <RouterProvider router={router} />;
}
