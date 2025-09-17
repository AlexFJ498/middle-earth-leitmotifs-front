import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import styles from "./ThemesList.module.scss";
import { useThemes } from "./useThemes";
import { Link, useNavigate } from "react-router-dom";
import { WidgetsSkeleton } from "./ThemesListSkeleton";
import { Theme } from "../../domain/Theme";

export function ThemesList({ repository }: { readonly repository: ApiThemeRepository }) {
	const { themes, isLoading } = useThemes(repository);

	if (isLoading) {
		return <WidgetsSkeleton />;
	}

	// Group themes by group.id to avoid collisions on same name and keep id handy
	const groupedThemes = themes.reduce((acc, theme) => {
		const groupId = theme.group.id;
		if (!acc[groupId]) {
			acc[groupId] = { name: theme.group.name || "Without Group", themes: [] as Theme[] };
		}
		acc[groupId].themes.push(theme);
		return acc;
	}, {} as Record<string, { name: string; themes: Theme[] }>);

	const groupEntries = Object.entries(groupedThemes);

	return (
		<>
		{themes.length === 0 ? (
			<div><span>No themes found</span></div>
		) : (
		<div className="grid grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 w-[98%] max-w-[2000px] min-h-[calc(100vh-3rem)] mx-auto my-5 mb-9 p-6 rounded-[2rem] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] ring-1 ring-[rgba(191,167,106,0.35)] shadow-[0_6px_22px_rgba(0,0,0,0.35)] backdrop-blur-sm">
			{groupEntries.map(([groupId, data]) => (
				<GroupThemesList key={groupId} groupId={groupId} groupName={data.name} groupThemes={data.themes} />
			))}
		</div>
		)}
		</>
	);
}

function CategoryThemesList({
	categoryName,
	themes,
}: {
	readonly categoryName: string;
	readonly themes: readonly Theme[];
}) {
	return (
		<div key={categoryName} style={{ marginTop: "1rem" }}>
			<span className={styles.categoryLabel}>{categoryName}</span>
			<div className={styles.themeChips}>
				{themes.map((theme) => (
					<Link
						to={`/themes/${theme.id}`}
						key={theme.id}
						className={styles.themeChip}
						title={theme.name}
						style={{ textDecoration: "none" }}
					>
						{theme.name}
					</Link>
				))}
			</div>
		</div>
	);
}

function GroupThemesList({
	groupId,
	groupName,
	groupThemes,
}: {
	readonly groupId: string;
	readonly groupName: string;
	readonly groupThemes: readonly Theme[];
}) {
	const navigate = useNavigate();
	const noCategory = groupThemes.filter((t) => !t.category);
	const withCategory = groupThemes.filter((t) => t.category);
	const categories = Array.from(new Set(withCategory.map((t) => t.category.name)));

	const goToGroup = () => navigate(`/groups/${groupId}`);
	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			goToGroup();
		}
	};

	return (
		<article
			className="relative z-0 flex flex-col justify-start min-h-[420px] max-h-[420px] p-10 overflow-hidden text-foreground bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-xl shadow-[0_10px_30px_rgba(58,44,10,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(58,44,10,0.35)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/40">
			<button
				onClick={goToGroup}
				onKeyDown={handleKey}
				className="group text-left m-0 mb-4 p-0 bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/50"
				aria-label={`Ir al grupo ${groupName}`}
			>
				<h2 className="m-0 text-[1.7rem] font-bold tracking-[0.09em] text-[var(--color-gold-soft)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] group-hover:underline underline-offset-4">
					{groupName}
				</h2>
			</button>
			<div className="flex-1 overflow-y-auto text-[1.12rem] leading-[1.55] pr-1">
				{/* Themes without category */}
				{noCategory.length > 0 && (
					<div className={styles.themeChips}>
						{noCategory.map((theme) => (
							<Link
								to={`/themes/${theme.id}`}
								key={theme.id}
								className={styles.themeChip}
								title={theme.name}
								style={{ textDecoration: "none" }}
							>
								{theme.name}
							</Link>
						))}
					</div>
				)}
				{/* Themes grouped by category */}
				{categories.map((catName) => (
					<CategoryThemesList
						key={catName}
						categoryName={catName}
						themes={withCategory.filter((t) => t.category.name === catName)}
					/>
				))}
			</div>
		</article>
	);
}
