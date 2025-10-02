import { Link } from 'react-router-dom';
import { TipSpotifySignIn } from '../../components/TipSpotifySignIn';

export function Home() {

	return (
		<div className="relative">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(58,44,10,0.35),transparent_65%)]" />
				<div className="absolute inset-0 backdrop-blur-[0.125rem]" />
			</div>

			<div className="mx-auto w-[98%] max-w-[100rem] my-6 md:my-10 p-6 md:p-10 rounded-[2rem] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] border border-[rgba(191,167,106,0.35)] shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.35)] backdrop-blur-sm">
			<section className="mx-auto max-w-5xl pt-4 md:pt-6 pb-20 px-2 md:px-4">
				<div className="text-center">
					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-gold-soft)] to-[var(--color-gold)] bg-clip-text text-transparent drop-shadow-[0_0.25rem_1.25rem_rgba(0,0,0,0.45)]">
						The musical themes of Middle-earth
					</h1>
					<p className="mt-6 mx-auto max-w-2xl text-lg leading-relaxed text-foreground/85">
						Explore the leitmotifs of Howard Shore's award-winning scores for <span className="font-semibold">The Lord of the Rings</span> trilogy—described and organized with reference to Doug Adams' work. A clear, visual way to navigate themes: their first appearances, narrative roles, and thematic relationships.
					</p>

					<TipSpotifySignIn />

					<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							to="/themes"
							className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium bg-[var(--color-gold-soft)] text-[#1d1a11] shadow-[0_0.25rem_1.125rem_rgba(0,0,0,0.35)] hover:shadow-[0_0.5rem_1.75rem_rgba(0,0,0,0.45)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60"
						>
							Browse Themes
						</Link>
						<Link
							to="/about"
							className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium border border-[var(--color-gold-soft)] text-[var(--color-gold-soft)] hover:bg-[var(--color-gold-soft)]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60"
						>
							About the Project
						</Link>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-2 md:px-4 pb-14 grid gap-8 md:grid-cols-3">
				<FeatureCard
					title="First Appearance"
					desc="Find the track and moment where each theme first emerges."
					icon={<span aria-hidden className="text-xl md:text-2xl">🎬</span>}
				/>
				<FeatureCard
					title="Thematic Structure"
					desc="Connect motives to their groups and categories to understand their relationships."
					icon={<span aria-hidden className="text-xl md:text-2xl">🧭</span>}
				/>
				<FeatureCard
					title="Narrative Meaning"
					desc="Discover the meaning of each theme and its role in the narrative."
					icon={<span aria-hidden className="text-xl md:text-2xl">📜</span>}
				/>
			</section>
			</div>
		</div>
	);
}

function FeatureCard({ title, desc, icon }: { readonly title: string; readonly desc: string; readonly icon: React.ReactNode }) {
	return (
		<div className="group relative overflow-hidden rounded-xl border border-[rgba(191,167,106,0.35)] bg-[var(--panel-gradient),var(--color-background)] p-5 md:p-6 shadow-[0_0.25rem_0.875rem_rgba(0,0,0,0.25)] transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_0.5rem_1.375rem_rgba(0,0,0,0.45)] hover:border-[var(--color-gold)]">
			<div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-200 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_55%)]" />
			<div className="flex items-start gap-3 md:flex-col md:gap-2 xl:flex-row mb-3">
				<div className="shrink-0 h-10 w-10 md:h-11 md:w-11 rounded-lg bg-[rgba(191,167,106,0.12)] text-[var(--color-gold-soft)] flex items-center justify-center border border-[rgba(191,167,106,0.35)] transition-colors">
					{icon}
				</div>
				<h3 className="flex-1 min-w-0 leading-tight m-0 font-semibold tracking-wide text-[var(--color-gold)] group-hover:text-[var(--color-gold-soft)] text-base md:text-[1.05rem] xl:text-lg transition-colors">
					{title}
				</h3>
			</div>
			<p className="text-sm leading-relaxed text-foreground/80 m-0">
				{desc}
			</p>
		</div>
	);
}
