import { ApiGroupRepository } from "../../infrastructure/ApiGroupRepository";
import { Link } from "react-router-dom";
import { useGroups } from "./useGroups";

export function GroupsList({ repository }: { readonly repository: ApiGroupRepository }) {
	const { groups, isLoading } = useGroups(repository);

	if (isLoading) {
		return (
			<div className="grid place-items-center w-full min-h-[calc(100vh-3rem)]">
				<span>Loading groups...</span>
			</div>
		);
	}

	return (
		<>
			{groups.length === 0 ? (
				<div><span>No groups found</span></div>
			) : (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 w-[98%] max-w-[100rem] min-h-[calc(100vh-3rem)] mx-auto my-5 mb-9 p-6 rounded-[2rem] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] ring-1 ring-[rgba(191,167,106,0.35)] shadow-[0_0.375rem_1.375rem_rgba(0,0,0,0.35)] backdrop-blur-sm">
				{groups.map(({ id: groupId, name: groupName, imageUrl: groupImageUrl }) => (
					<GroupThemesList key={groupId} groupId={groupId} groupName={groupName} groupImageUrl={groupImageUrl} />
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
			className={`group relative z-0 grid place-items-center text-center min-h-[21rem] max-h-[21rem] p-6 sm:p-8 md:p-10 overflow-hidden text-foreground ${imageSrc ? "bg-cover bg-center" : "bg-[var(--color-card-bg)]"} border border-[rgba(191,167,106,0.35)] hover:border-[var(--color-gold)] focus-visible:border-[var(--color-gold)] active:border-[var(--color-gold)] rounded-xl shadow-[0_0.625rem_1.875rem_rgba(58,44,10,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_1.25rem_2.5rem_rgba(58,44,10,0.35)] active:scale-[1.01] active:shadow-[0_1rem_2.25rem_rgba(58,44,10,0.45)] active:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/40 cursor-pointer w-full select-none`}
		>
			{imageSrc && (
				<>
					<div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 group-focus-visible:bg-black/30 group-active:bg-black/25 transition-colors duration-200 pointer-events-none" />
					<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_100%)] pointer-events-none" />
					<div className="absolute inset-0 opacity-0 group-hover:opacity-80 group-focus-visible:opacity-80 group-active:opacity-100 transition-opacity duration-200 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_55%)] pointer-events-none" />
				</>
			)}
			<div className="relative z-[1] w-full max-w-full px-5 py-3 rounded-xl border border-[rgba(191,167,106,0.35)] group-active:border-[var(--color-gold)] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] backdrop-blur-md shadow-[0_0.375rem_1rem_rgba(0,0,0,0.45)] group-active:brightness-110">
				<h2 className="m-0 text-[1.7rem] font-bold tracking-[0.09em] text-[var(--color-gold-soft)] drop-shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.55)] text-center break-words [hyphens:auto]">
					{groupName}
				</h2>
			</div>
		</Link>
	);
}
