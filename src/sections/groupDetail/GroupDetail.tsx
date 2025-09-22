import { ThemeRepository } from "../../domain/ThemeRepository";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { useGroup } from "./useGroup";
import { GroupRepository } from "../../domain/GroupRepository";
import { Theme } from "../../domain/Theme";
import { useThemesByGroup } from "../groupsList/useThemesByGroup";
import { MarkdownText } from "../../components/MarkdownText";

type ThemeCardProps = { theme: Theme; isOpen: boolean; onToggle: () => void };

const ThemeCard = ({ theme: t, isOpen, onToggle }: ThemeCardProps) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const [maxH, setMaxH] = useState(0);
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
			<div className="rounded-xl border border-[rgba(191,167,106,0.35)] bg-[linear-gradient(145deg,rgba(191,167,106,0.06),rgba(58,44,10,0.2))] shadow-[0_0.25rem_0.875rem_rgba(0,0,0,0.25)]">
				<button
					type="button"
					aria-expanded={isOpen}
					aria-controls={`desc-${t.id}`}
					onClick={onToggle}
					className="group w-full text-left p-4 cursor-pointer"
				>
					<div className="text-xl font-extrabold text-[var(--color-gold-soft)] transition-colors duration-200 group-hover:text-[var(--color-gold)]">{t.name}</div>
					{t.firstHeard?.movie && (
						<div className="mt-1 text-[0.95rem] italic text-white/80">
							<span className="font-semibold not-italic">First Heard:</span> {t.firstHeard?.name} ({t.firstHeard?.movie?.name})
							<span className="not-italic ml-2 inline-flex items-center px-2 py-0.5 rounded-full border border-[rgba(191,167,106,0.35)] bg-[rgba(191,167,106,0.12)] text-[0.85rem] text-[var(--color-gold-soft)]">
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
					<div className={`${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"} p-4 border-t border-[rgba(191,167,106,0.25)] transition-all duration-300 ease-in-out`}>
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
	const isExpanded = (id: string) => expanded.has(id);
	const toggleExpanded = (id: string) => {
		setExpanded(prev => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id); else next.add(id);
			return next;
		});
	};

	if (isLoadingGroup || isLoadingThemesByGroup) {
		return (
			<div className="max-w-[70rem] mx-auto px-8 pb-20 text-foreground">
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
		<div className="max-w-[70rem] mx-auto px-8 pb-20 text-foreground leading-relaxed">
			<div className="mb-4 grid grid-cols-[auto,1fr,auto] items-center">
				<button
					onClick={() => navigate(-1)}
					aria-label="Volver"
					className="justify-self-start self-center relative top-[2px] inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.9rem] font-semibold tracking-wide text-[var(--color-background)] bg-[linear-gradient(135deg,var(--color-gold),var(--color-gold-soft))] border border-[var(--color-gold)] shadow-[0_0.25rem_0.875rem_rgba(191,167,106,0.25)] transition-all duration-200 hover:shadow-[0_0.5rem_1.375rem_rgba(191,167,106,0.35)] hover:brightness-110 cursor-pointer active:shadow-[0_0.25rem_0.875rem_rgba(191,167,106,0.25)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50">
					← Back
				</button>
				<h1 className="m-0 self-center leading-none text-center text-[2.4rem] font-extrabold tracking-[0.12em] uppercase text-[var(--color-gold)] drop-shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.35)] font-[Cinzel,serif]">
					{group.name}
				</h1>
				<button
					aria-hidden="true"
					tabIndex={-1}
					type="button"
					className="justify-self-end self-center relative top-[2px] opacity-0 pointer-events-none inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.9rem] font-semibold tracking-wide border"
				>
					← Back
				</button>
			</div>
			<div className="mb-6 grid gap-6 md:grid-cols-2 items-stretch">
				<div className="relative rounded-2xl overflow-hidden border border-[rgba(191,167,106,0.4)] shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.35)] h-full">
					<img src={imageSrc} alt={`${group.name} cover`} loading="lazy" className="w-full h-64 object-cover md:h-full" />
					<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_100%)] pointer-events-none" />
				</div>
				<div className="grid gap-3.5 p-6 rounded-2xl bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] border border-[rgba(191,167,106,0.4)] backdrop-blur-md shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.35)] h-full">
					<MarkdownText className="m-0 text-base" text={group.description} />
				</div>
			</div>

			{themes.length === 0 ? (
				<p className="mt-6 text-center text-base">No themes found in this group.</p>
			) : (
				<>
					<p className="mt-2 mb-2 text-center text-[0.8rem] text-white/70">
						Tip: For the best playback experience, sign in to Spotify in this browser.{" "}
						<a
							href="https://accounts.spotify.com/login"
							target="_blank"
							rel="noopener noreferrer"
							className="ml-2 underline underline-offset-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]"
						>
							Sign in
						</a>
					</p>
					<h2 className="mt-10 mb-4 text-2xl font-bold text-[var(--color-gold-soft)] drop-shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.35)] text-center">Themes in this group</h2>

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
	)
}
