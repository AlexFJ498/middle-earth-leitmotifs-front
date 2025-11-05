import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export function Menu() {
	const location = useLocation();
	const themesActiveOverride = location.pathname.startsWith('/groups') || location.pathname.startsWith('/themes');
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = wrapperRef.current;
		const update = () => {
			const h = el?.offsetHeight ?? 0;
			document.documentElement.style.setProperty('--app-navbar-h', h ? `${h}px` : '');
		};
		update();
		let ro: ResizeObserver | undefined;
		if ('ResizeObserver' in globalThis.window && el) {
			ro = new ResizeObserver(update);
			ro.observe(el);
		} else {
			const onResize = () => update();
			window.addEventListener('resize', onResize);
		}
		const onLoad = () => update();
		window.addEventListener('load', onLoad);
		return () => {
			ro?.disconnect();
			window.removeEventListener('load', onLoad);
		};
	}, [location.pathname]);

	return (
		<div ref={wrapperRef} className="fixed inset-x-0 top-0 z-50 w-full border-b border-[rgba(191,167,106,0.35)] bg-background backdrop-blur supports-[backdrop-filter]:bg-background/65">
			<Navbar className="bg-transparent px-4 md:px-6 font-cinzel">
			<NavbarBrand className="min-w-0">
				<NavLink
					to="/"
					className="inline-block max-w-[60vw] sm:max-w-none whitespace-normal break-words [hyphens:auto] leading-tight text-center font-bold text-base sm:text-lg md:text-xl text-[var(--color-gold)] transition-colors duration-200 hover:text-[var(--color-gold-soft)]"
				>
					Middle-earth Leitmotifs
				</NavLink>
			</NavbarBrand>
			<NavbarContent justify='end' className="gap-2 md:gap-3">
				<NavbarItem>
					<NavLink
						to="/themes"
						className={({ isActive }) => {
							const base = 'px-3 py-2 rounded-md text-sm';
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
							const base = 'px-3 py-2 rounded-md text-sm';
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
		</div>
	);
}
