import { Outlet, NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { ErrorBoundary } from './ErrorBoundary';
import TopBarProgressByLocation from "./TopBarProgressByLocation";

export function Layout() {
	return (
		<>
			<TopBarProgressByLocation />
			<div className="min-h-screen flex flex-col bg-background text-foreground">
				<Navbar className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 px-4 md:px-6 font-cinzel">
					<NavbarBrand>
						<NavLink
							to="/"
							className="font-bold text-lg md:text-xl bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent"
						>
							Middle-earth Leitmotifs
						</NavLink>
					</NavbarBrand>
					<NavbarContent justify='end' className="gap-2 md:gap-3">
						<NavbarItem>
							<NavLink
								to="/themes"
								className={({ isActive }) => {
									const base = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
									const active = 'bg-primary text-primary-foreground shadow-sm';
									const inactive = 'text-foreground/80 hover:text-foreground hover:bg-foreground/5';
									return `${base} ${isActive ? active : inactive}`;
								}}
							>
								Themes
							</NavLink>
						</NavbarItem>
						<NavbarItem>
							<NavLink
								to="/about"
								className={({ isActive }) => {
									const base = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
									const active = 'bg-primary text-primary-foreground shadow-sm';
									const inactive = 'text-foreground/80 hover:text-foreground hover:bg-foreground/5';
									return `${base} ${isActive ? active : inactive}`;
								}}
							>
								About
							</NavLink>
						</NavbarItem>
					</NavbarContent>
				</Navbar>

				<div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

				<main id="main-content" className="relative flex-1">
					<div className="mx-auto max-w-8xl p-4 md:p-6 lg:p-8">
							<ErrorBoundary>
							<Outlet />
						</ErrorBoundary>
					</div>
				</main>

				<footer className="mt-8 border-t border-foreground/10 bg-background/80 backdrop-blur">
					<div className="mx-auto max-w-7xl px-4 md:px-6 py-6 text-center text-sm text-foreground/70">
						<p className="mb-1">
							&copy; {new Date().getFullYear()} Middle-earth Leitmotifs
						</p>
					</div>
				</footer>
			</div>
		</>
	);
}
