import { useEffect, useRef } from "react";
import { Theme } from "../domain/Theme";

declare global {
	interface Window {
		onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
		SpotifyIframeApi?: any;
	}
}

function toSpotifyTrackUri(value: string): string | null {
	const input = value.trim();
	const uriMatch = /^spotify:track:([a-zA-Z0-9]{22})$/.exec(input);
	if (uriMatch) {
		return `spotify:track:${uriMatch[1]}`;
	}

	try {
		const url = new URL(input);
		if (url.protocol !== "https:" || url.hostname !== "open.spotify.com") {
			return null;
		}

		const pathMatch = /^\/(?:intl-[^/]+\/)?track\/([a-zA-Z0-9]{22})\/?$/.exec(url.pathname);

		return pathMatch ? `spotify:track:${pathMatch[1]}` : null;
	} catch {
		return null;
	}
}

export default function SpotifyEmbed({
	uri,
	onTimeUpdate,
	seconds = 0,
	autoplay = false,
	onAutoplayHandled,
}: Readonly<{ 
	uri: string,
	onTimeUpdate?: (seconds: number) => void,
	seconds?: number,
	autoplay?: boolean,
	onAutoplayHandled?: () => void,
}>): JSX.Element {
	const iframeRef     = useRef<HTMLDivElement | null>(null);
	const controllerRef = useRef<any>(null);
	const apiRef        = useRef<any>(null);
	const trackUri      = toSpotifyTrackUri(uri);
	const latestUriRef  = useRef<string | null>(trackUri);
	const hasStartedBool = useRef<boolean>(false);

	// Keep the latest URI in a ref to avoid stale-closure issues
	useEffect(() => {
		latestUriRef.current = trackUri;
		// If a controller already exists and uri changed to a non-empty value, load it
		if (trackUri && controllerRef.current) {
			controllerRef.current.loadUri(trackUri);
			onTimeUpdate?.(0);
			// If parent requested autoplay, try to play now and notify parent
			if (autoplay && controllerRef.current) {
				try { controllerRef.current.play(); } catch {}
				onAutoplayHandled?.();
			}
		}
	}, [trackUri]);

	useEffect(() => {
		const scriptId = "spotify-iframe-api";
		if (!document.getElementById(scriptId)) {
			const script = document.createElement("script");
			script.id = scriptId;
			script.src = "https://open.spotify.com/embed/iframe-api/v1";
			document.body.appendChild(script);
		}

		// Register the global ready callback once; create the controller only when we have a non-empty URI
		globalThis.window.onSpotifyIframeApiReady = (IFrameAPI) => {
			// Store API globally for reuse
			globalThis.window.SpotifyIframeApi = IFrameAPI;
			apiRef.current = IFrameAPI;
			
			const currentUri = latestUriRef.current;
			const element    = iframeRef.current;
			if (!element || !currentUri) return;
			
			// Reset any previous content before creating a new controller
			element.innerHTML = "";
			const options = {
				uri   : currentUri,
				width : "100%",
				height: "152",
			};

			IFrameAPI.createController(element, options, (controller: any) => {
				controllerRef.current = controller;
				controller.addListener("playback_update", handlePlaybackUpdated);
				controller.addListener("playback_started", handlePlaybackStarted);
			});

			onTimeUpdate?.(0);
		};

		// If API is already loaded (e.g., component remounted), use it immediately
		if (globalThis.window.SpotifyIframeApi && !apiRef.current) {
			apiRef.current = globalThis.window.SpotifyIframeApi;
		}

		// Cleanup function to destroy controller on unmount
		return () => {
			if (controllerRef.current) {
				controllerRef.current = null;
			}
		};
	}, []);

	// If API is already ready (callback fired) but controller wasn't created because uri was empty,
	// try to create it when uri becomes available
	useEffect(() => {
		if (!apiRef.current) return;
		if (!iframeRef.current) return;
		if (controllerRef.current) return;
		if (!trackUri) return;

		iframeRef.current.innerHTML = "";
		const options = { uri: trackUri, width: "100%", height: "152" };
		apiRef.current.createController(iframeRef.current, options, (controller: any) => {
			controllerRef.current = controller;
			controller.addListener("playback_update", handlePlaybackUpdated);
			controller.addListener("playback_started", handlePlaybackStarted);
		});

		onTimeUpdate?.(0);
	}, [trackUri]);

	function handlePlaybackStarted() {
		hasStartedBool.current = true;
	}

	function handlePlaybackUpdated(state: any) {
		const seconds = state.data.position / 1000;
		onTimeUpdate?.(seconds);
	}

	useEffect(() => {
		if (seconds === -1) return;
		if (!controllerRef.current) return;
		let target = Number.isFinite(seconds) ? seconds : 0;

		if (seconds === 0) target = 1;

		if (!autoplay) {
			// Non-autoplay behavior: only seek if playback already started.
			if (hasStartedBool.current) {
				try { controllerRef.current.seek(target); } catch (e) { }
			}
			return;
		}

		// Autoplay requested: try to play then seek (fallback)
		if (hasStartedBool.current) {
			try { controllerRef.current.seek(target); } catch (e) { }
		} else {
			try { controllerRef.current.play(); } catch (e) { }
			setTimeout(() => {
				if (!controllerRef.current) return;
				try { controllerRef.current.seek(target); } catch (e) { }
			}, 500);
		}
	}, [seconds]);

	return (
		<div ref={iframeRef}></div>
	);
}

export function getSpotifyEmbedSrc (t: Theme): string | null {
	const raw = t.firstHeard.spotifyURL ?? "";
	const value = raw.trim();
	let id: string | null;
	try {
		const url = new URL(value);
		// Matches /track/{id} or /intl-xx/track/{id}
		const re = /^\/(?:intl-[^/]+\/)?track\/([a-zA-Z0-9]+)$/;
		const m = re.exec(url.pathname);
		id = m?.[1] ?? null;
	} catch {
		id = null;
	}
	if (!id) return null;
	const startFrag = Number.isFinite(t.firstHeardStart) ? `?t=${t.firstHeardStart}` : "";
	return `https://open.spotify.com/embed/track/${id}${startFrag}`;
};
