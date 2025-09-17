import { GroupRepository } from "../../domain/GroupRepository";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useGroup } from "./useGroup";

export function GroupDetail({ repository }: { readonly repository: GroupRepository}) {
	const { id } = useParams() as { id: string };
	const groupId = useMemo(() => id, [id]);
	const { group, isLoading } = useGroup(repository, groupId);
	const navigate = useNavigate();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (group === null) {
		navigate("/themes");
		return null;
	}

	return (
		<div className="max-w-[900px] mx-auto pt-12 px-8 pb-20 text-foreground leading-relaxed">
			<button
				onClick={() => navigate(-1)}
				aria-label="Volver"
				className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-[0.9rem] font-semibold tracking-wide text-[var(--color-background)] bg-[linear-gradient(135deg,var(--color-gold),var(--color-gold-soft))] border border-[var(--color-gold)] shadow-[0_4px_14px_rgba(191,167,106,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(191,167,106,0.35)] active:translate-y-0 active:shadow-[0_4px_14px_rgba(191,167,106,0.25)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50">
				← Back
			</button>
			<h1 className="m-0 mb-5 text-[2.4rem] font-extrabold tracking-[0.12em] text-[var(--color-gold)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] font-[Cinzel,serif]">
				{group.name}
			</h1>
		</div>
	)
}
