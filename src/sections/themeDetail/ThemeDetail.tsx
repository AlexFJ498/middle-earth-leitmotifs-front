import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeRepository } from "../../domain/ThemeRepository";
import { useTheme } from "./useTheme";
import { WidgetsSkeleton } from "./ThemeDetailSkeleton";

export function ThemeDetail({ repository }: { readonly repository: ThemeRepository }) {
	const { id } = useParams() as { id: string };
	const themeId = useMemo(() => id, [id]);
	const { theme, isLoading } = useTheme(repository, themeId);
	const navigate = useNavigate();

	if (isLoading) {
		return <WidgetsSkeleton />;
	}

	if (theme === null) {
		navigate("/themes");
		return null;
	}

	const firstHeardTrack = theme.firstHeard;
	const firstHeardMovieName = firstHeardTrack?.movie?.name;
	const groupName = theme.group?.name;
	const categoryName = theme.category?.name;

	return (
		<div className="max-w-[900px] mx-auto pt-12 px-8 pb-20 text-foreground leading-relaxed">
			<button
				onClick={() => navigate(-1)}
				aria-label="Volver"
				className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-[0.9rem] font-semibold tracking-wide text-[var(--color-background)] bg-[linear-gradient(135deg,var(--color-gold),var(--color-gold-soft))] border border-[var(--color-gold)] shadow-[0_4px_14px_rgba(191,167,106,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(191,167,106,0.35)] active:translate-y-0 active:shadow-[0_4px_14px_rgba(191,167,106,0.25)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50">
				← Back
			</button>
			<h1 className="m-0 mb-5 text-[2.4rem] font-extrabold tracking-[0.12em] text-[var(--color-gold)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] font-[Cinzel,serif]">
				{theme.name}
			</h1>
			<div className="grid gap-3.5 p-6 rounded-2xl bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] border border-[rgba(191,167,106,0.4)] backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
				<p className="m-0 text-base">
					<strong className="text-[var(--color-gold-soft)] font-semibold">First heard:</strong> {firstHeardTrack?.name}
					{firstHeardMovieName ? <span> ({firstHeardMovieName})</span> : null}
				</p>
				<p className="m-0 text-base">
					<strong className="text-[var(--color-gold-soft)] font-semibold">Group:</strong> {groupName}
				</p>
				{categoryName && (
					<p className="m-0 text-base">
						<strong className="text-[var(--color-gold-soft)] font-semibold">Category:</strong> {categoryName}{' '}
						<span className="inline-block ml-2 px-3 py-1 text-[0.75rem] font-semibold tracking-wide text-[var(--color-background)] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.25)] bg-[linear-gradient(135deg,var(--color-leaf),var(--color-gold))]">
							{categoryName}
						</span>
					</p>
				)}
			</div>
		</div>
	);
}
