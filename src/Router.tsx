import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AboutFactory } from './sections/about/AboutFactory';
import { Layout } from './sections/layout/Layout';
import { GroupsListFactory } from './sections/groupsList/GroupsListFactory';
import { GroupDetailFactory } from './sections/groupDetail/GroupDetailFactory';
import { HomeFactory } from './sections/home/HomeFactory';
import { TracksFactory } from './sections/tracks/TracksFactory';

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
				path: "/themes/:groupId",
				element: GroupDetailFactory.create(),
			},
			{
				path: "/tracks",
				element: TracksFactory.create(),
			},
            {
                path: "/about",
                element: AboutFactory.create(),
            },
            // Catch-all for unknown routes -> redirect to home
            {
                path: "*",
                element: <Navigate to="/" replace />,
            },
        ]
    } 
]);

export function Router() {
    return <RouterProvider router={router} />;
}
