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
import { getSpotifyEmbedSrc } from "../../components/SpotifyIFrame";

type ThemeCardProps = { theme: Theme; isOpen: boolean; onToggle: () => void };

const ThemeCard = ({ theme: t, isOpen, onToggle }: ThemeCardProps) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<HTMLDivElement>(null);
	const [maxH, setMaxH] = useState(0);
	const [isRevealed, setIsRevealed] = useState(false);
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

		// Check if the user has requested reduced motion
		const prefersReduced = globalThis.window !== undefined && globalThis.window.matchMedia && globalThis.window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReduced) {
			setIsRevealed(true);
			return;
		}
		
		// Use IntersectionObserver to reveal when in view
		const io = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsRevealed(true);
				io.unobserve(entry.target);
			}
		}, { threshold: 0.5 }); // 50% visible
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

	const spotifyEmbedSrc = getSpotifyEmbedSrc(t);

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
							<div className={styles.firstHeard}>
								<span className="font-semibold not-italic">First Heard:</span> {t.firstHeard?.name} ({t.firstHeard?.movie?.name})
								<span className={styles.timeChip}>
									{formatTime(t.firstHeardStart)}
									<span className={styles.dash}>–</span>
									{formatTime(t.firstHeardEnd)}
								</span>
							</div>
						)}
					</button>
					<div
						id={`desc-${t.id}`}
						ref={contentRef}
						style={{ maxHeight: isOpen ? maxH : 0 }}
						className={styles.contentClip}
					>
						<div className={`${styles.content} ${isOpen ? styles.contentOpen : styles.contentClosed}`}>
							{isOpen && spotifyEmbedSrc !== null && (
								<iframe
									title={`Spotify player for ${t.firstHeard?.name ?? t.name}`}
									src={spotifyEmbedSrc}
									width="100%"
									height="152"
									style={{ border: 0 }}
									loading="lazy"
									allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
									className={styles.iframe}
									onLoad={handleIframeLoad}
								/>
							)}
							{t.description && (
								<MarkdownText className={styles.themeMarkdown} text={t.description} />
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

		globalThis.window.addEventListener("keydown", onKey);
		return () => {
			globalThis.window.removeEventListener("keydown", onKey);
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
			<div className={styles.container}>
				<div className={styles.outerPanel}>
					<div className={styles.panelInner}>
						<div className={styles.header}>
							<button
								onClick={() => navigate(-1)}
								aria-label="Back"
								className={`${styles.backButton} group justify-self-start`}
							>
								<span className="inline-flex items-center gap-2">
									<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" className="transition-transform duration-200 group-hover:-translate-x-0.5 group-active:-translate-x-1 group-focus-visible:-translate-x-0.5">
										<path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<span>Back</span>
								</span>
							</button>
							<h1 className={styles.title}>
								{group.name}
							</h1>
						</div>
						<div className={styles.imageDescGrid}>
							<button
								type="button"
								className={`${styles.imageButton} group`}
								aria-label="View full size image"
								onClick={() => setIsImageModalOpen(true)}
							>
								<img src={imageSrc} alt={`${group.name} cover`} loading="lazy" className={styles.imageMedia} />
								<div className={styles.imageOverlayGradient} />
								<div className={styles.imageOverlayGlow} />
							</button>
							<div className={styles.descWrapper}>
								<div className={styles.descPanel}>
									<MarkdownText className={styles.descMarkdown} text={group.description} />
								</div>
							</div>
						</div>

						{themes.length === 0 ? (
							<p className={styles.emptyText}>No themes found in this group.</p>
						) : (
							<>
								<TipSpotifySignIn />
								<h2 className={styles.themesTitle}>Themes in this group</h2>

								{(() => {
									interface CategoryBucket { id: string; name: string; items: Theme[] }
									const uncategorized: Theme[] = themes.filter((t: Theme) => !t.category);
									const byCategory = new Map<string, CategoryBucket>();
									for (const t of themes) {
										if (!t.category) continue;
										const key = t.category.id;
										const existing = byCategory.get(key);
										if (existing) {
											existing.items.push(t);
										} else {
											byCategory.set(key, { id: key, name: t.category.name, items: [t] });
										}
									}
									const orderedCategories = Array.from(byCategory.values());

									const renderTheme = (t: Theme) => (
										<ThemeCard key={t.id} theme={t} isOpen={isExpanded(t.id)} onToggle={() => toggleExpanded(t.id)} />
									);

									return (
										<div className="space-y-8">
											{uncategorized.length > 0 && (
												<ul className="space-y-4">
													{uncategorized.map(renderTheme)}
												</ul>
											)}

											{orderedCategories.map((cat: CategoryBucket) => (
												<div key={cat.id}>
													<div className={styles.categoryTitle}>{cat.name}</div>
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

			<div
				aria-hidden={!isImageModalOpen}
				className={`${styles.modalRoot} ${isImageModalOpen ? styles.modalOpen : styles.modalClosed}`}
			>
				<button
					type="button"
					aria-label="Close modal"
					className={styles.modalBackdrop}
					onClick={() => setIsImageModalOpen(false)}
				/>
				<dialog
					open={isImageModalOpen}
					aria-label={`${group.name} image viewer`}
					className={`${styles.modalDialog} ${isImageModalOpen ? styles.dialogOpen : styles.dialogClosed} group`}
				>
					<button
						type="button"
						aria-label="Close"
						onClick={() => setIsImageModalOpen(false)}
						ref={closeBtnRef}
						className={styles.modalCloseButton}
					>
						<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" className="fill-none stroke-current stroke-2">
							<path d="M6 6l12 12M18 6L6 18" />
						</svg>
					</button>
					<img
						src={imageSrc}
						alt={`${group.name} full size`}
						className={styles.modalImage}
					/>
				</dialog>
			</div>
		</>
	)
}
