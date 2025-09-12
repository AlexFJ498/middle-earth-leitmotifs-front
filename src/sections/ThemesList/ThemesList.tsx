import { ThemesResponses } from "../../infrastructure/ApiResponse";
import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import styles from "./ThemesList.module.scss";
import { useThemes } from "./useThemes";
import { WidgetsSkeleton } from "./WidgetsSkeleton";

export function ThemesList({ repository }: { readonly repository: ApiThemeRepository }) {
	const { themes, isLoading } = useThemes(repository);

	if (isLoading) {
		return <WidgetsSkeleton />;
	}

	// Group themes by group
	const groupedThemes = themes.reduce((acc, theme) => {
		const groupName = theme.group.name || "Without Group";
		if (!acc[groupName]) {
			acc[groupName] = [];
		}
		acc[groupName].push(theme);

		return acc;
	}, {} as Record<string, ThemesResponses[]>);

	const groupEntries = Object.entries(groupedThemes);

	return (
		<>
		{themes.length === 0 ? (
			<div><span>No themes found</span></div>
		) : (
		<div className={styles.container}>
			{groupEntries.map(([groupName, groupThemes]) => (
				<GroupThemesList key={groupName} groupName={groupName} groupThemes={groupThemes} />
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
	readonly themes: readonly ThemesResponses[];
}) {
	return (
		<div key={categoryName} style={{ marginTop: "1rem" }}>
			<span className={styles.categoryLabel}>{categoryName}</span>
			<div className={styles.themeChips}>
				{themes.map((theme) => (
					<span key={theme.id} className={styles.themeChip} title={theme.name}>
						{theme.name}
					</span>
				))}
			</div>
		</div>
	);
}

function GroupThemesList({
	groupName,
	groupThemes,
}: {
	readonly groupName: string;
	readonly groupThemes: readonly ThemesResponses[];
}) {
	const noCategory = groupThemes.filter((t) => !t.category);
	const withCategory = groupThemes.filter((t) => t.category);
	const categories = Array.from(new Set(withCategory.map((t) => t.category.name)));

	return (
		<div key={groupName} className={styles.card}>
			<h2 className={styles.cardTitle}>{groupName}</h2>
			<div className={styles.cardContent}>
				{/* Themes without category */}
				{noCategory.length > 0 && (
					<div className={styles.themeChips}>
						{noCategory.map((theme) => (
							<span key={theme.id} className={styles.themeChip} title={theme.name}>
								{theme.name}
							</span>
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
		</div>
	);
}
