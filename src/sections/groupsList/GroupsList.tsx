import { ApiThemeRepository } from "../../infrastructure/ApiThemeRepository";
import { useThemes } from "./useThemes";
import { useNavigate } from "react-router-dom";
import { Theme } from "../../domain/Theme";

export function GroupsList({ repository }: { readonly repository: ApiThemeRepository }) {
	const { themes, isLoading } = useThemes(repository);

	if (isLoading) {
		return (
			<div className="grid place-items-center w-full min-h-[calc(100vh-3rem)]">
				<span>Loading themes...</span>
			</div>
		);
	}

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
		<div className="grid grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 w-[98%] max-w-[100rem] min-h-[calc(100vh-3rem)] mx-auto my-5 mb-9 p-6 rounded-[2rem] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] ring-1 ring-[rgba(191,167,106,0.35)] shadow-[0_0.375rem_1.375rem_rgba(0,0,0,0.35)] backdrop-blur-sm">
			{groupEntries.map(([groupId, data]) => (
				<GroupThemesList key={groupId} groupId={groupId} groupName={data.name} />
			))}
		</div>
		)}
		</>
	);
}

function GroupThemesList({
	groupId,
	groupName,
}: {
	readonly groupId: string;
	readonly groupName: string;
}) {
	const navigate = useNavigate();

	const goToGroup = () => navigate(`/groups/${groupId}`);
	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			goToGroup();
		}
	};

	return (
		<article
			className="relative z-0 grid place-items-center text-center min-h-[21rem] max-h-[21rem] p-10 overflow-hidden text-foreground bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-xl shadow-[0_0.625rem_1.875rem_rgba(58,44,10,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_1.25rem_2.5rem_rgba(58,44,10,0.35)] focus-within:ring-2 focus-within:ring-[var(--color-gold)]/40">
			<button
				onClick={goToGroup}
				onKeyDown={handleKey}
				className="group m-0 p-0 bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/50"
				aria-label={`Go to ${groupName} group`}
			>
				<h2 className="m-0 text-[1.7rem] font-bold tracking-[0.09em] text-[var(--color-gold-soft)] drop-shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.45)] group-hover:underline underline-offset-4">
					{groupName}
				</h2>
			</button>
		</article>
	);
}
