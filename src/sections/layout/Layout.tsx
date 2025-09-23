import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { ErrorBoundary } from './ErrorBoundary';
import TopBarProgressByLocation from "./TopBarProgressByLocation";

export function Layout() {
	const location = useLocation();
	const themesActiveOverride = location.pathname.startsWith('/groups') || location.pathname.startsWith('/themes');
	return (
		<>
			<TopBarProgressByLocation />
			<div className="min-h-screen flex flex-col bg-background text-foreground">
				<Navbar className="sticky top-0 z-50 border-b border-[rgba(191,167,106,0.35)] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 px-4 md:px-6 font-cinzel">
					<NavbarBrand>
						<NavLink
							to="/"
							className="font-bold text-lg md:text-xl text-[var(--color-gold)] transition-colors duration-200 hover:text-[var(--color-gold-soft)]"
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
									const active = 'text-[var(--color-gold-soft)] underline decoration-[var(--color-gold-soft)] decoration-2 underline-offset-[6px]';
									const inactive = 'text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]';
									return `${base} ${(isActive || themesActiveOverride) ? active : inactive}`;
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
									const active = 'text-[var(--color-gold-soft)] underline decoration-[var(--color-gold-soft)] decoration-2 underline-offset-[6px]';
									const inactive = 'text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]';
									return `${base} ${isActive ? active : inactive}`;
								}}
							>
								About
							</NavLink>
						</NavbarItem>
					</NavbarContent>
				</Navbar>

				<div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />

				<main id="main-content" className="relative flex-1">
					<div className="mx-auto max-w-8xl p-4 md:p-6 lg:p-8">
							<ErrorBoundary>
							<Outlet />
						</ErrorBoundary>
					</div>
				</main>

				<footer className="border-t border-[rgba(191,167,106,0.35)] bg-background/80 backdrop-blur">
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
