import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AboutFactory } from './sections/about/AboutFactory';
import { Layout } from './sections/layout/Layout';
import { GroupsListFactory } from './sections/groupsList/GroupsListFactory';
import { GroupDetailFactory } from './sections/groupDetail/GroupDetailFactory';
import { ThemeEditor } from './sections/dev/ThemeEditor';
import { HomeFactory } from './sections/home/HomeFactory';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
			{
				path: "",
				element: HomeFactory.create(),
			},
            {
                path: "/themes",
                element: GroupsListFactory.create(),
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
