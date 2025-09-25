import { ThemeRepository } from "../../domain/ThemeRepository";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { useGroup } from "./useGroup";
import { GroupRepository } from "../../domain/GroupRepository";
import { Theme } from "../../domain/Theme";
import { useThemesByGroup } from "../groupsList/useThemesByGroup";
import { MarkdownText } from "../../components/MarkdownText";
import { TipSpotifySignIn } from "../../components/TipSpotifySignIn";
import styles from "./GroupDetail.module.scss";

type ThemeCardProps = { theme: Theme; isOpen: boolean; onToggle: () => void };

const ThemeCard = ({ theme: t, isOpen, onToggle }: ThemeCardProps) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<HTMLDivElement>(null);
	const [isRevealed, setIsRevealed] = useState(false);
	const [maxH, setMaxH] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
	useEffect(() => {
		const el = contentRef.current;
		if (!el) return;
		setMaxH(el.scrollHeight);
		if (isOpen) {
			requestAnimationFrame(() => {
				const el2 = contentRef.current;
				if (el2) setMaxH(el2.scrollHeight);
			});
		}
	}, [t.description, isOpen]);

	useEffect(() => {
		const node = revealRef.current;
		if (!node) return;
		const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReduced) {
			setIsRevealed(true);
			return;
		}
		const io = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsRevealed(true);
				io.unobserve(entry.target);
			}
		}, { threshold: 0.5 });
		io.observe(node);
		return () => io.disconnect();
	}, []);

	const handleIframeLoad = () => {
		const el = contentRef.current;
		if (el) setMaxH(el.scrollHeight);
	};

	const formatTime = (secs?: number): string => {
		if (!Number.isFinite(secs)) return "0:00";
		const total = Math.max(0, Math.floor(secs as number));
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	const getSpotifyEmbedSrc = (): string | null => {
		const raw: unknown = (t.firstHeard as any)?.spotifyURL ?? (t.firstHeard as any)?.spotifyId;
		if (typeof raw !== "string" || !raw.trim()) return null;
		const value = raw.trim();
		let id: string | null = null;
		if (/^https?:\/\//i.test(value)) {
			try {
				const u = new URL(value);
				// Matches /track/{id} or /intl-xx/track/{id}
				const re = /^\/(?:intl-[^/]+\/)?track\/([a-zA-Z0-9]+)$/;
				const m = re.exec(u.pathname);
				id = m?.[1] ?? null;
			} catch {
				id = null;
			}
		} else if (/^[a-zA-Z0-9]+$/.test(value)) {
			id = value;
		}
		if (!id) return null;
		const startFrag = Number.isFinite(t.firstHeardStart) ? `?t=${t.firstHeardStart}` : "";
		return `https://open.spotify.com/embed/track/${id}${startFrag}`;
	};

	return (
		<li className="list-none">
				<div ref={revealRef} className={`${styles.themeReveal} ${isRevealed ? styles.revealed : ""}`}>
				<div className={`${styles.themeCard} ${isOpen || isPressed ? styles.themeCardOpen : ""} ${isPressed ? styles.themeCardPressed : ""}`}>
				<button
					type="button"
					aria-expanded={isOpen}
					aria-controls={`desc-${t.id}`}
					onClick={onToggle}
					onMouseDown={() => setIsPressed(true)}
					onMouseUp={() => setIsPressed(false)}
					onMouseLeave={() => setIsPressed(false)}
					onTouchStart={() => setIsPressed(true)}
					onTouchEnd={() => setIsPressed(false)}
					onTouchCancel={() => setIsPressed(false)}
					className={styles.themeCardButton}
				>
					<div className={`${styles.themeName} ${isOpen || isPressed ? styles.themeNameOpen : ""}`}>{t.name}</div>
					{t.firstHeard?.movie && (
						<div className="mt-1 text-[0.95rem] italic text-white/80">
							<span className="font-semibold not-italic">First Heard:</span> {t.firstHeard?.name} ({t.firstHeard?.movie?.name})
							<span className={styles.timeChip}>
								{formatTime(t.firstHeardStart)}
								<span className="mx-1 text-white/60">–</span>
								{formatTime(t.firstHeardEnd)}
							</span>
						</div>
					)}
				</button>
				<div
					id={`desc-${t.id}`}
					ref={contentRef}
					style={{ maxHeight: isOpen ? maxH : 0 }}
					className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
				>
					<div className={`${styles.content} ${isOpen ? styles.contentOpen : styles.contentClosed}`}>
						{isOpen && getSpotifyEmbedSrc() && (
							<iframe
								title={`Spotify player for ${t.firstHeard?.name ?? t.name}`}
								src={getSpotifyEmbedSrc()!}
								width="100%"
								height="152"
								style={{ border: 0 }}
								loading="lazy"
								allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
								className="w-full rounded-xl mb-3"
								onLoad={handleIframeLoad}
							/>
						)}
						{t.description && (
							<MarkdownText className="text-base leading-relaxed" text={t.description} />
						)}
					</div>
				</div>
				</div>
			</div>
		</li>
	);
};

export function GroupDetail(
	{
		groupRepository,
		themeRepository
	}: { readonly groupRepository: GroupRepository; readonly themeRepository: ThemeRepository }
) {
	const { groupId } = useParams() as { groupId: string };
	const memoizedGroupId = useMemo(() => groupId, [groupId]);
	const { group, isLoadingGroup } = useGroup(groupRepository, memoizedGroupId);
	const { themes, isLoadingThemesByGroup } = useThemesByGroup(themeRepository, memoizedGroupId);
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const lastFocusedRef = useRef<HTMLElement | null>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);
	const isExpanded = (id: string) => expanded.has(id);
	const toggleExpanded = (id: string) => {
		setExpanded(prev => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id); else next.add(id);
			return next;
		});
	};

	useEffect(() => {
		if (!isImageModalOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsImageModalOpen(false);
		};
		// Lock scroll
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		// Manage focus
		lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
		setTimeout(() => closeBtnRef.current?.focus(), 0);

		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
			lastFocusedRef.current?.focus?.();
		};
	}, [isImageModalOpen]);

	if (isLoadingGroup || isLoadingThemesByGroup) {
		return (
			<div className="max-w-[70rem] mx-auto px-8 text-foreground">
				<div className="animate-pulse grid gap-4">
					<div className="h-8 w-48 rounded bg-white/10" />
					<div className="h-64 rounded-2xl bg-white/5 border border-white/10" />
					<div className="h-24 rounded-2xl bg-white/5 border border-white/10" />
				</div>
			</div>
		);
	}

	if (group === null) {
		navigate("/themes");
		return null;
	}

	const resolveImageSrc = (path: string): string => {
		if (!path) return path;
		if (path.startsWith("http")) return path;
		if (path.startsWith("/")) return path;
		if (path.startsWith("assets/")) return `/${path}`;
		return `/assets/${path}`;
	};
	const imageSrc = resolveImageSrc(group.imageUrl);

	return (
		<>
			<div className="max-w-[75rem] mx-auto text-foreground leading-relaxed">
			<div className="rounded-3xl border border-[rgba(191,167,106,0.35)] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] backdrop-blur-sm shadow-[0_0.75rem_2rem_rgba(0,0,0,0.25)]">
				<div className="px-6 md:px-8 py-6 md:py-8">
					<div className="mb-6 grid grid-cols-[auto,1fr,auto] items-center">
						<button
							onClick={() => navigate(-1)}
							aria-label="Back"
							className="group justify-self-start self-center relative top-[2px] inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.9rem] font-semibold tracking-wide text-[var(--color-background)] bg-[linear-gradient(135deg,var(--color-gold),var(--color-gold-soft))] border border-[var(--color-gold)] filter brightness-100 transition-all duration-200 ease-out hover:brightness-110 cursor-pointer">
							<span className="inline-flex items-center gap-2">
								<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" className="transition-transform duration-200 group-hover:-translate-x-0.5 group-active:-translate-x-1 group-focus-visible:-translate-x-0.5">
									<path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<span>Back</span>
							</span>
						</button>
						<h1 className="mt-5 self-center leading-none text-center text-[2.4rem] font-extrabold tracking-[0.12em] uppercase text-[var(--color-gold)] drop-shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.35)] font-[Cinzel,serif]">
							{group.name}
						</h1>
					</div>
					<div className="mb-6 grid gap-6 lg:grid-cols-2 items-stretch">
						<button
							type="button"
							className="group relative rounded-2xl overflow-hidden border border-[rgba(191,167,106,0.35)] shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.35)] h-full cursor-pointer p-0 transition-all duration-200 ease-out hover:scale-[1.005] hover:border-[var(--color-gold)] hover:shadow-[0_0.45rem_1.25rem_rgba(0,0,0,0.4)]"
							aria-label="Ver imagen a tamaño completo"
							onClick={() => setIsImageModalOpen(true)}
						>
							<img src={imageSrc} alt={`${group.name} cover`} loading="lazy" className="w-full h-64 object-cover lg:h-full" />
							<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_100%)] pointer-events-none" />
							<div className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-200 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_55%)]" />
						</button>
						<div className="rounded-2xl overflow-hidden">
							<div className="flex flex-col justify-center gap-3.5 p-8 rounded-2xl bg-[var(--panel-gradient)] border border-[rgba(191,167,106,0.35)] shadow-[0_0.25rem_0.875rem_rgba(0,0,0,0.25)] h-full">
								<MarkdownText className="m-0 text-[1.1rem]" text={group.description} />
							</div>
						</div>
					</div>

					{themes.length === 0 ? (
						<p className="mt-6 text-center text-base">No themes found in this group.</p>
					) : (
						<>
							<TipSpotifySignIn />
							<h2 className="mt-10 mb-4 text-2xl font-bold text-[var(--color-gold)] drop-shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.35)] text-center">Themes in this group</h2>

							{(() => {
								interface CategoryBucket { id: string; name: string; items: Theme[] }
								const uncategorized: Theme[] = themes.filter((t: Theme) => !t.category);
								const byCategory = new Map<string, CategoryBucket>();
								themes.forEach((t: Theme) => {
									if (!t.category) return;
									const key = t.category.id;
									const existing = byCategory.get(key);
									if (existing) {
										existing.items.push(t);
									} else {
										byCategory.set(key, { id: key, name: t.category.name, items: [t] });
									}
								});
								const orderedCategories = Array.from(byCategory.values())
									.sort((a, b) => a.name.localeCompare(b.name))
									.map(cat => ({ ...cat, items: cat.items.slice().sort((a, b) => a.name.localeCompare(b.name)) }));

								const renderTheme = (t: Theme) => (
									<ThemeCard key={t.id} theme={t} isOpen={isExpanded(t.id)} onToggle={() => toggleExpanded(t.id)} />
								);

								return (
									<div className="space-y-8">
										{uncategorized.length > 0 && (
											<ul className="space-y-4">
												{uncategorized.slice().sort((a, b) => a.name.localeCompare(b.name)).map(renderTheme)}
											</ul>
										)}

										{orderedCategories.map((cat: CategoryBucket) => (
											<div key={cat.id}>
												<div className="mb-3 text-xl font-semibold tracking-wide text-[var(--color-gold)]">{cat.name}</div>
												<ul className="space-y-4">
													{cat.items.map(renderTheme)}
												</ul>
											</div>
										))}
									</div>
								);
							})()}
						</>
					)}
				</div>
			</div>
		</div>
		{/* Image Modal Overlay */}
		<div
			aria-hidden={!isImageModalOpen}
			className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-200 ${isImageModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
		>
			<button
				type="button"
				aria-label="Cerrar modal"
				className="absolute inset-0 bg-black/70"
				onClick={() => setIsImageModalOpen(false)}
			/>
						<dialog
				open={isImageModalOpen}
							aria-label={`${group.name} image viewer`}
							className={`group relative mx-4 max-w-6xl w-auto bg-transparent p-0 border-0 ${isImageModalOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-1"} transition-transform duration-200`}
			>
							<button
								type="button"
								aria-label="Close"
								onClick={() => setIsImageModalOpen(false)}
								ref={closeBtnRef}
								className="absolute top-3 right-3 z-[101] inline-flex items-center justify-center w-11 h-11 rounded-full text-[var(--color-background)] bg-[linear-gradient(135deg,var(--color-gold),var(--color-gold-soft))] border border-[var(--color-gold)] shadow-[0_0.5rem_1.25rem_rgba(191,167,106,0.35)] transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 filter brightness-100 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/60 cursor-pointer"
							>
								<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" className="fill-none stroke-current stroke-2">
									<path d="M6 6l12 12M18 6L6 18" />
								</svg>
							</button>
				<img
					src={imageSrc}
					alt={`${group.name} full size`}
					className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-[0_1rem_3rem_rgba(0,0,0,0.5)]"
				/>
			</dialog>
		</div>
		</>
	)
}
