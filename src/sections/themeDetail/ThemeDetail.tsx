import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeRepository } from "../../domain/ThemeRepository";
import { useTheme } from "./useTheme";
import styles from "./ThemeDetail.module.scss";
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
		return <div>No theme found</div>;
	}

	const firstHeardTrack = theme.firstHeard;
	const firstHeardMovieName = firstHeardTrack?.movie?.name;
	const groupName = theme.group?.name;
	const categoryName = theme.category?.name;

	return (
		<div className={styles.detailWrapper}>
			<button className={styles.backButton} onClick={() => navigate(-1)} aria-label="Volver">
				← Back
			</button>
			<h1 className={styles.title}>{theme.name}</h1>
			<div className={styles.metaBlock}>
				<p className={styles.metaItem}>
					<strong>First heard:</strong> {firstHeardTrack?.name}
					{firstHeardMovieName ? <span> ({firstHeardMovieName})</span> : null}
				</p>
				<p className={styles.metaItem}>
					<strong>Group:</strong> {groupName}
				</p>
				{categoryName && (
					<p className={styles.metaItem}>
						<strong>Category:</strong> {categoryName} <span className={styles.categoryTag}>{categoryName}</span>
					</p>
				)}
			</div>
		</div>
	);
}
