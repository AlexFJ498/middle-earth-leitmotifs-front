import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./Tracks.module.scss";
import type { TrackThemeRepository } from "../../domain/TrackThemeRepository";
import { useMovies } from "./useMovies";
import { useTracksByMovie } from "./useTracksByMovie";
import { useTracksThemesByTrack } from "./useTracksThemesByTrack";
import { MovieRepository } from "../../domain/MovieRepository";
import { TrackRepository } from "../../domain/TrackRepository";
import SpotifyEmbed from "../../components/SpotifyIFrame";
import { InfoIcon } from "../../components/icons";

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
	// URL path params
	const { trackId } = useParams<{ trackId?: string }>();
	const navigate = useNavigate();
	
	// State for selections
	const [selectedMovieId, setSelectedMovieId]   = useState<string | null>(null);
	const [selectedTrackId, setSelectedTrackId]   = useState<string | null>(null);
	const [currentSecond, setCurrentSecond]       = useState<number>(0);
	const [currentUri, setCurrentUri]             = useState<string>("");
	const [seconds, setSeconds]                   = useState<number>(0);
	const [shouldAutoplay, setShouldAutoplay]     = useState<boolean>(false);
	const [pendingScrollIdx, setPendingScrollIdx] = useState<number | null>(null);
	const lastActiveIdxRef                        = useRef<number | null>(null);
	const isInternalNavigationRef                 = useRef<boolean>(false);

	// Data hooks
	const { movies, isLoadingMovies }        = useMovies(movieRepository);
	const { tracks, isLoadingTracksByMovie } = useTracksByMovie(trackRepository, selectedMovieId ?? "");
	const { tracksThemes, isLoadingTrackThemesByTrack }  = useTracksThemesByTrack(trackThemeRepository, selectedTrackId ?? "");

	// When movie changes, ensure track is cleared
	useEffect(() => {
		if (selectedMovieId && selectedTrackId) {
			// Check if current track belongs to current movie's tracks
			const trackExists = tracks.some(t => t.id === selectedTrackId);
			if (!trackExists && !isLoadingTracksByMovie) {
				setSelectedTrackId(null);
			}
		}
	}, [selectedMovieId, selectedTrackId, tracks, isLoadingTracksByMovie]);

	// Auto-select from URL trackId param
	useEffect(() => {
		// Skip if this is an internal navigation (from handleSelectTrack)
		if (isInternalNavigationRef.current) {
			isInternalNavigationRef.current = false;
			return;
		}
		
		if (!trackId || tracks.length === 0) return;
		
		const track = tracks.find(t => t.id === trackId);
		if (track && selectedTrackId !== trackId) {
			setSelectedTrackId(trackId);
			setCurrentUri(track.spotifyURL ?? "");
			setCurrentSecond(0);
			setSeconds(-1);
			setShouldAutoplay(true);
		}
	}, [trackId, tracks, selectedTrackId]);

	// Auto-select movie when trackId is in URL (infer from all movies)
	useEffect(() => {
		if (!trackId || movies.length === 0 || selectedMovieId) return;
		
		// Search for the track across all movies to find its movie
		const findMovieForTrack = async () => {
			for (const movie of movies) {
				const movieTracks = await trackRepository.findByMovieId(movie.id);
				if (movieTracks.some(t => t.id === trackId)) {
					setSelectedMovieId(movie.id);
					break;
				}
			}
		};
		
		findMovieForTrack();
	}, [trackId, movies, selectedMovieId, trackRepository]);

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
		// Clear trackId from URL when changing movie
		navigate('/tracks', { replace: true });
	};
	const handleSelectTrack = (trackId: string, spotifyURL: string | null) => {
		// Mark this as internal navigation to prevent useEffect from re-executing
		isInternalNavigationRef.current = true;
		
		setSelectedTrackId(trackId);
		setCurrentUri(spotifyURL ?? "");
		setCurrentSecond(0);
		setSeconds(-1);
		setShouldAutoplay(true);
		// Update URL with trackId path param
		navigate(`/tracks/${trackId}`, { replace: true });
	};
	const handleSeconds = (secs: number) => {
		setSeconds(secs);
		setCurrentSecond(secs);
	};

	useEffect(() => {
		if (pendingScrollIdx === null) return;
		const idx    = pendingScrollIdx;
		const listEl = document.querySelector(`.${styles.themeList}`);
		if (!(listEl instanceof HTMLElement)) {
			setPendingScrollIdx(null);
			return;
		}
		const el = listEl.querySelector(`[data-idx="${idx}"]`);
		if (!(el instanceof HTMLElement)) {
			setPendingScrollIdx(null);
			return;
		}

		const listRect      = listEl.getBoundingClientRect();
		const elRect        = el.getBoundingClientRect();
		const elTopRelative = elRect.top - listRect.top;
		const rowHeight     = el.clientHeight || elRect.height || 0;

		let desiredTop = listEl.scrollTop + elTopRelative - rowHeight - 6;

		const maxScroll = Math.max(0, listEl.scrollHeight - listEl.clientHeight);
		desiredTop = Math.min(Math.max(0, desiredTop), maxScroll);
		listEl.scrollTo({ top: desiredTop, behavior: 'smooth' });
		setPendingScrollIdx(null);
	}, [pendingScrollIdx]);

	useEffect(() => {
		if (!tracksThemes || tracksThemes.length === 0) {
			lastActiveIdxRef.current = null;
			return;
		}
		const activeIdx = tracksThemes.findIndex((tt) =>
			currentUri === tt.track.spotifyURL &&
			currentSecond >= tt.startSecond &&
			currentSecond <= tt.endSecond
		);
		if (activeIdx === -1) {
			lastActiveIdxRef.current = null;
			return;
		}
		if (lastActiveIdxRef.current !== activeIdx) {
			setPendingScrollIdx(activeIdx);
			lastActiveIdxRef.current = activeIdx;
		}
	}, [tracksThemes, currentUri, currentSecond]);

	return (
		<div className={styles.container}>
			<div className={styles.outerPanel}>
				<div className={styles.panelInner}>
					<h1 className={styles.title}>Tracks</h1>

					<p className={styles.intro}>
						Here you can listen to the complete tracks and explore in real time the themes that are sounding at each moment. Select a movie to reveal its tracks, choose a track to view the detected themes, and press play to start the simulation.
					</p>
					<p className={styles.intro}>
						You may listen to the full track or jump directly to a specific theme by clicking it in the list. Some themes are marked as variants — alternate or adapted versions of a main theme.
					</p>
					<p className={styles.intro}>
						To play tracks from this page <span className={styles.highlight}>you must be signed in to Spotify in this browser</span>. On mobile, please switch your browser to desktop site mode. <a href="https://accounts.spotify.com/login" target="_blank" rel="noopener noreferrer">Sign in</a>
					</p>
					<p className={styles.intro}>
						The information shown here was compiled from <a href="https://www.jwfan.com/forums/index.php?/topic/27532-the-themes-of-howard-shores-the-lord-of-the-rings-copied-from-musicofmiddelearthcom/" target="_blank" rel="noopener noreferrer">this source</a>. It may not be complete or fully accurate.
					</p>

					<div className={styles.introDivider} aria-hidden="true" />

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

					<div className={styles.embedSpacer}>
						<SpotifyEmbed uri={currentUri} onTimeUpdate={setCurrentSecond} seconds={seconds} autoplay={shouldAutoplay} onAutoplayHandled={() => setShouldAutoplay(false)} />
					</div>

					{/* Main two panes */}
					<div className={styles.mainGrid}>
						{/* Left: tracks list */}
						<section className={`${styles.pane} ${styles.leftPane}`} aria-label="Tracks list">
							<div className={styles.tracksHeader}>TRACKS</div>
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
							<div className={`${styles.tracksHeader} ${styles.themesHeader}`}>
								<span className={styles.currentTimeChip}>{formatTime(currentSecond)}</span>
								<span>THEMES</span>
							</div>
							<div className={styles.rightPaneInner}>
								{!selectedTrackId && (
									<div className={styles.emptyBox}>Select a track to view its themes</div>
								)}

								{selectedTrackId && isLoadingTrackThemesByTrack && (
									<div className="grid" style={{ gap: "0.75rem" }}>
										{Array.from({ length: 5 }).map((_, i) => (
											<div key={i} className={`${styles.skeleton} ${styles.lineSkeleton}`} style={{ height: "2.25rem" }} />
										))}
									</div>
								)}

								{selectedTrackId && !isLoadingTrackThemesByTrack && (
									tracksThemes.length === 0 ? (
										<div className={styles.emptyBox}>No themes found for this track.</div>
									) : (
										<div className={styles.themeList}>
											{tracksThemes.map((tt, idx) => {
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
														data-idx={idx}
														>
														<span className={styles.timeChip}>{start}<span className={styles.dash}>–</span>{end}</span>
														<div className={styles.themeItem}>
															<button
																type="button"
																className={styles.themeItemContent}
																aria-label={`Theme ${tt.theme.name}${tt.isVariant ? ' (variant)' : ''}`}
																aria-pressed={active}
																onClick={() => {
																	if (tt.track.spotifyURL) {
																		setCurrentUri(tt.track.spotifyURL);
																		handleSeconds(tt.startSecond);
																		setTimeout(() => {
																			setSeconds(-1);
																		}, 500);

																		lastActiveIdxRef.current = idx;
																		setPendingScrollIdx(idx);
																	}
																}}
															>
																<div className={styles.themeItemLeft}>
																	<span className={styles.themeName}>{tt.theme.name}</span>
																	{tt.isVariant && <span className={styles.variantBadge}>VARIATION</span>}
																</div>
															</button>
															<Link
																to={`/themes/${tt.theme.group.id}/${tt.theme.id}`}
																target="_blank"
																rel="noopener noreferrer"
																className={styles.themeInfoButton}
																aria-label={`View ${tt.theme.name} details in new tab`}
																title="Theme info"
															>
																<InfoIcon size={14} />
															</Link>
														</div>
													</div>
												);
											})}
										</div>
									)
								)}
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
