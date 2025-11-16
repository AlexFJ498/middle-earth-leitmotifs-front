import { GitHubIcon, LinkedInIcon, EmailIcon } from '../../components/icons';

export function About() {
	return (
		<div className="max-w-[75rem] mx-auto text-foreground leading-relaxed">
			<div className="rounded-3xl border border-[rgba(191,167,106,0.35)] bg-[rgba(16,32,48,1)] backdrop-blur-sm shadow-[0_0.75rem_2rem_rgba(0,0,0,0.25)]">
				<div className="px-6 md:px-8 py-6 md:py-8">
					<h1 className="m-0 mb-4 text-center text-[2.2rem] md:text-[2.6rem] font-extrabold tracking-[0.08em] uppercase text-[var(--color-gold)] drop-shadow-[0_0.125rem_0.5rem_rgba(0,0,0,0.35)] font-[Cinzel,serif]">
						About the Project
					</h1>

					<div className="grid gap-6">
						<section className="rounded-2xl border border-[rgba(191,167,106,0.35)] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.35)] backdrop-blur-md p-6 md:p-7">
							<h2 className="m-0 mb-2 text-xl md:text-2xl font-bold text-[var(--color-gold)]">Project Overview</h2>
							<p className="m-0 text-base md:text-[1.05rem]">
								This project began as a personal initiative to learn and use modern web development tools through a subject I care about. After reading Doug Adams' book, it became clear that a concise, well-structured way to browse the leitmotifs would be both useful and enjoyable. I hope the fans of LOTR music find it helpful as well.
							</p>
							<p className="mt-3 text-[0.95rem] md:text-base">
								It is free, non-commercial, and released under the MIT License. The goal is not to provide exhaustive analysis, but rather a practical, readable interface that offers context without attempting to replace the source material. Suggestions, issues, and pull requests are welcome.
							</p>
							<div className="mt-8 grid gap-4 md:grid-cols-3">
								<div>
									<h3 className="m-0 mb-1 text-lg font-semibold text-[var(--color-gold)]/90">Open Source</h3>
									<ul className="m-0 space-y-2 text-[0.95rem] md:text-base list-disc pl-5">
										<li>
											<a className="underline underline-offset-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]" href="https://github.com/AlexFJ498/middle-earth-leitmotifs-front" target="_blank" rel="noopener noreferrer">Frontend Repository</a>
										</li>
										<li>
											<a className="underline underline-offset-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]" href="https://github.com/AlexFJ498/middle-earth-leitmotifs-api" target="_blank" rel="noopener noreferrer">Backend Repository</a>
										</li>
									</ul>
								</div>
								<div>
									<h3 className="m-0 mb-1 text-lg font-semibold text-[var(--color-gold)]/90">Tech Stack</h3>
									<ul className="m-0 space-y-2 text-[0.95rem] md:text-base list-disc pl-5">
										<li>Backend: Go + PostgreSQL</li>
										<li>Frontend: React</li>
									</ul>
								</div>
								<div>
									<h3 className="m-0 mb-1 text-lg font-semibold text-[var(--color-gold)]/90">Contact</h3>
									<ul className="m-0 mt-2 space-y-2 text-[0.95rem] md:text-base pl-0">
										<li>
											<a
												className="inline-flex items-center gap-2 underline underline-offset-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]"
												href="https://github.com/AlexFJ498"
												target="_blank"
												rel="noopener noreferrer"
											>
												<GitHubIcon size={20} className="opacity-90" />
												GitHub
											</a>
										</li>
										<li>
											<a
												className="inline-flex items-center gap-2 underline underline-offset-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]"
												href="https://www.linkedin.com/in/alejandro-fuerte-jurado/"
												target="_blank"
												rel="noopener noreferrer"
											>
												<LinkedInIcon size={20} className="opacity-90" />
												LinkedIn
											</a>
										</li>
										<li>
											<a
												className="inline-flex items-center gap-2 underline underline-offset-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]"
												href="mailto:alejfuejur@gmail.com"
												rel="noopener noreferrer"
											>
												<EmailIcon size={20} className="opacity-90" />
												Email
											</a>
										</li>
									</ul>
								</div>
							</div>
						</section>
						<section className="rounded-2xl border border-[rgba(191,167,106,0.35)] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.35)] backdrop-blur-md p-6 md:p-7">
							<h2 className="m-0 mb-2 text-xl md:text-2xl font-bold text-[var(--color-gold)]">Sources</h2>
							<p className="m-0 text-base md:text-[1.05rem]">
								The thematic names and structure presented here are derived from Doug Adams' book <i>“The Music of The Lord of the Rings Films”</i>. All original naming remains the property of the author. The brief descriptions were written specifically for this site and are intentionally limited.
							</p>
							<p className="m-0 text-base md:text-[1.05rem] mt-3">
								You may purchase the book here: <a className="underline underline-offset-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]" href="https://www.amazon.com/Music-Lord-Rings-Films-Comprehensive/dp/0739071572?ref_=ast_author_dp" target="_blank" rel="noopener noreferrer">The Music of The Lord of the Rings Films</a>.
							</p>
							<p className="m-0 text-base md:text-[1.05rem] mt-3">
								All information in the Tracks section was compiled from <a className="underline underline-offset-2 text-[var(--color-gold)] hover:text-[var(--color-gold-soft)]" href="https://www.jwfan.com/forums/index.php?/topic/27532-the-themes-of-howard-shores-the-lord-of-the-rings-copied-from-musicofmiddelearthcom/" target="_blank" rel="noopener noreferrer">this source</a> and may not be complete or fully accurate.
							</p>
						</section>

						<section className="rounded-2xl border border-[rgba(191,167,106,0.35)] bg-[linear-gradient(145deg,rgba(191,167,106,0.08),rgba(58,44,10,0.25))] shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.35)] backdrop-blur-md p-6 md:py-7 md:px-7 px-6 py-6">
							<h2 className="m-0 mb-2 text-xl md:text-2xl font-bold text-[var(--color-gold)]">Rights</h2>
							<p className="m-0 text-base md:text-[1.05rem]">
								This is an independent, non-commercial fan project, not affiliated with New Line Cinema, Warner Bros., The Saul Zaentz Company, or The Tolkien Estate. Please support the creators by purchasing official editions and licensed soundtracks.
							</p>
							<p className="mt-3 text-base md:text-[1.05rem]">
								Music compositions and track titles are the property of Howard Shore and the respective rights holders. “Middle-earth”, film titles, character names, place names, and other related names and terms are the property of The Tolkien Estate and other rights holders.
							</p>
							<p className="mt-3 text-base md:text-[1.05rem]">
								No sheet music or film audio is hosted; embedded players link only to official Spotify releases. Images on this site were generated using AI and serve only as illustrative placeholders; they are not official artwork.
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
