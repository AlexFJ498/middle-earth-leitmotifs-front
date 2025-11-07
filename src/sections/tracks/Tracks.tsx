import { useState } from "react";
import styles from "./Tracks.module.scss";
import type { TrackThemeRepository } from "../../domain/TrackThemeRepository";
import { useMovies } from "./useMovies";
import { useTracksByMovie } from "./useTracksByMovie";
import { useTracksThemes } from "./useTracksThemes";
import { MovieRepository } from "../../domain/MovieRepository";
import { TrackRepository } from "../../domain/TrackRepository";
import SpotifyEmbed from "../../components/SpotifyIFrame";

export function Tracks(
	{
		movieRepository,
		trackRepository,
		trackThemeRepository,
	}: {
		readonly movieRepository     : MovieRepository;
		readonly trackRepository     : TrackRepository;
		readonly trackThemeRepository: TrackThemeRepository;
	}) {
	// State for selections
	const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
	const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
	const [currentSecond, setCurrentSecond]     = useState<number>(0);
	const [currentUri, setCurrentUri]           = useState<string>("");

	// Data hooks
	const { movies, isLoadingMovies }        = useMovies(movieRepository);
	const { tracks, isLoadingTracksByMovie } = useTracksByMovie(trackRepository, selectedMovieId ?? "");
	const { tracksThemes, isLoadingThemes }  = useTracksThemes(trackThemeRepository, selectedTrackId ?? "");

	const formatTime = (secs: number): string => {
		if (!Number.isFinite(secs) || secs < 0) return "0:00";
		const total = Math.floor(secs);
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	// Handlers
	const handleSelectMovie = (movieId: string) => {
		setSelectedMovieId(movieId);
		setSelectedTrackId(null);
	};
	const handleSelectTrack = (trackId: string, spotifyURL: string | null) => {
		setSelectedTrackId(trackId);
		setCurrentUri(spotifyURL ?? "");
	};

	return (
		<div className={styles.container}>
			<div className={styles.outerPanel}>
				<div className={styles.panelInner}>
					<h1 className={styles.title}>Tracks</h1>

					{/* Movies selector */}
					<div className={styles.moviesBar}>
						{isLoadingMovies && (
							<>
								<div className={`${styles.skeleton} ${styles.moviesSkeleton}`} />
								<div className={`${styles.skeleton} ${styles.moviesSkeleton}`} />
								<div className={`${styles.skeleton} ${styles.moviesSkeleton}`} />
							</>
						)}
						{!isLoadingMovies && movies.map((m) => (
							<button
								key={m.id}
								type="button"
								className={styles.movieBtn}
								aria-pressed={selectedMovieId === m.id}
								onClick={() => handleSelectMovie(m.id)}
								title={m.name}
							>
								{m.name}
							</button>
						))}
					</div>

					<SpotifyEmbed uri={currentUri} onTimeUpdate={setCurrentSecond} />

					{/* Main two panes */}
					<div className={styles.mainGrid}>
						{/* Left: tracks list */}
						<section className={`${styles.pane} ${styles.leftPane}`} aria-label="Tracks list">
							<div className={styles.tracksHeader}>Tracks</div>
							<div className={styles.tracksScroll}>
								{(!selectedMovieId && !isLoadingTracksByMovie) && (
									<div className={styles.emptyBox}>Select a movie to see its tracks</div>
								)}

								{isLoadingTracksByMovie && (
									<div className="grid" style={{ gap: "0.5rem" }}>
										{Array.from({ length: 6 }).map((_, i) => (
											<div key={i} className={`${styles.skeleton} ${styles.lineSkeleton}`} />
										))}
									</div>
								)}

								{!isLoadingTracksByMovie && selectedMovieId && (
									<ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
										{tracks.map((t) => (
											<li key={t.id}>
												<button
													type="button"
													onClick={() => handleSelectTrack(t.id, t.spotifyURL)}
													className={`${styles.trackItem} ${selectedTrackId === t.id ? styles.trackItemSelected : ""}`}
													aria-pressed={selectedTrackId === t.id}
												>
													<span className={styles.trackName}>{t.name}</span>
												</button>
											</li>
										))}
										{tracks.length === 0 && (
											<li>
												<div className={styles.emptyBox}>No tracks found for this movie.</div>
											</li>
										)}
									</ul>
								)}
							</div>
						</section>

						{/* Right: themes of selected track */}
						<section className={`${styles.pane} ${styles.rightPane}`} aria-label="Themes for selected track">
							{!selectedTrackId && (
								<div className={styles.emptyBox}>Select a track to view its themes</div>
							)}

							{selectedTrackId && isLoadingThemes && (
								<div className="grid" style={{ gap: "0.75rem" }}>
									{Array.from({ length: 5 }).map((_, i) => (
										<div key={i} className={`${styles.skeleton} ${styles.lineSkeleton}`} style={{ height: "2.25rem" }} />
									))}
								</div>
							)}

							{selectedTrackId && !isLoadingThemes && (
								tracksThemes.length === 0 ? (
									<div className={styles.emptyBox}>No themes found for this track.</div>
								) : (
									<div className={styles.themeList}>
										{tracksThemes.map((tt) => {
											const start = formatTime(tt.startSecond);
											const end = formatTime(tt.endSecond);
											const active =
												currentUri === tt.track.spotifyURL &&
												currentSecond >= tt.startSecond && 
												currentSecond <= tt.endSecond;
											return (
												<div
													key={`${tt.track.id}-${tt.theme.id}-${tt.startSecond}`}
													className={styles.themeRow}
													data-active={active ? "true" : "false"}
												>
													<span className={styles.timeChip}>{start}<span className={styles.dash}>–</span>{end}</span>
													<button
														type="button"
														className={styles.themeItem}
														aria-label={`Theme ${tt.theme.name}${tt.isVariant ? ' (variant)' : ''}`}
														aria-pressed={active}
													>
														<span className={styles.themeName}>{tt.theme.name}</span>
														{tt.isVariant && <span className={styles.variantBadge}>VARIANT</span>}
													</button>
												</div>
											);
										})}
									</div>
								)
							)}
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
