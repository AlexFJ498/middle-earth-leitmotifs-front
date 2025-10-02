import { ApiGroupRepository } from "../../infrastructure/ApiGroupRepository";
import { Link } from "react-router-dom";
import { useGroups } from "./useGroups";
import styles from "./GroupsList.module.scss";
import { GroupsListSkeleton } from "./GroupsListSkeleton";

export function GroupsList({ repository }: { readonly repository: ApiGroupRepository }) {
	const { groups, isLoading } = useGroups(repository);

	if (isLoading) {
		return <GroupsListSkeleton />;
	}

	return (
		<>
			{groups.length === 0 ? (
				<div><span>No groups found</span></div>
			) : (
			<div className={styles.gridContainer}>
				{groups.map(({ id: groupId, name: groupName, imageUrl: groupImageUrl }) => (
					<div key={groupId} className={styles.gridItem}>
						<GroupThemesList groupId={groupId} groupName={groupName} groupImageUrl={groupImageUrl} />
					</div>
				))}
			</div>
			)}
		</>
	);
}

function GroupThemesList({
	groupId,
	groupName,
	groupImageUrl,
}: {
	readonly groupId: string;
	readonly groupName: string;
	readonly groupImageUrl?: string;
}) {
	const resolveImageSrc = (path?: string): string | undefined => {
		if (!path) return undefined;
		if (path.startsWith("http")) return path;
		if (path.startsWith("/")) return path;
		if (path.startsWith("assets/")) return `/${path}`;
		return `/assets/${path}`;
	};

	const imageSrc = resolveImageSrc(groupImageUrl);
	const bgStyle = imageSrc ? { backgroundImage: `url("${imageSrc}")` } : undefined;

	return (
		<Link
			to={`/themes/${groupId}`}
			aria-label={`Go to ${groupName} group`}
			style={bgStyle}
			className={`${styles.card} ${imageSrc ? styles.cardImage : ""}`}
		>
			{imageSrc && (
				<>
					<div className={styles.imageOverlayTint} />
					<div className={styles.imageOverlayGradient} />
					<div className={styles.imageOverlayGlow} />
				</>
			)}
			<div className={styles.titleBox}>
				<h2 className={styles.title}>
					{groupName}
				</h2>
			</div>
		</Link>
	);
}
