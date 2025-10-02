import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import TopBarProgressByLocation from "./TopBarProgressByLocation";
import { Footer } from './Footer';
import { Menu } from './Menu';

export function Layout() {
	return (
		<>
			<TopBarProgressByLocation />
			<div className="min-h-screen flex flex-col bg-background text-foreground">
				<Menu />
				<div style={{ height: 'var(--app-navbar-h, 4rem)' }} />

				<main id="main-content" className="relative flex-1">
					<div className="mx-auto max-w-8xl p-4 md:p-6 lg:p-8">
						<ErrorBoundary>
							<Outlet />
						</ErrorBoundary>
					</div>
				</main>

				<Footer />
			</div>
		</>
	);
}
