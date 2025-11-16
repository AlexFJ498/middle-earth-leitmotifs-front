import { useEffect, useRef } from "react";
import { Theme } from "../domain/Theme";

declare global {
	interface Window {
		onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
	}
}

export default function SpotifyEmbed({
	uri,
	onTimeUpdate,
	seconds = 0,
}: Readonly<{ 
	uri: string,
	onTimeUpdate?: (seconds: number) => void,
	seconds?: number,
}>): JSX.Element {
	const iframeRef     = useRef<HTMLDivElement | null>(null);
	const controllerRef = useRef<any>(null);
	const apiRef        = useRef<any>(null);
	const latestUriRef  = useRef<string>(uri);
	const hasStartedBool = useRef<boolean>(false);

	// Keep the latest URI in a ref to avoid stale-closure issues
	useEffect(() => {
		latestUriRef.current = uri;
		// If a controller already exists and uri changed to a non-empty value, load it
		if (uri && controllerRef.current) {
			controllerRef.current.loadUri(uri);
		}
	}, [uri]);

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
		};
	}, []);

	// If API is already ready (callback fired) but controller wasn't created because uri was empty,
	// try to create it when uri becomes available
	useEffect(() => {
		if (!apiRef.current) return;
		if (!iframeRef.current) return;
		if (controllerRef.current) return;
		if (!uri) return;

		iframeRef.current.innerHTML = "";
		const options = { uri, width: "100%", height: "152" };
		apiRef.current.createController(iframeRef.current, options, (controller: any) => {
			controllerRef.current = controller;
			controller.addListener("playback_update", handlePlaybackUpdated);
			controller.addListener("playback_started", handlePlaybackStarted);
		});
	}, [uri]);

	function handlePlaybackStarted() {
		hasStartedBool.current = true;
	}

	function handlePlaybackUpdated(state: any) {
		const seconds = state.data.position / 1000;
		onTimeUpdate?.(seconds);
	}

	useEffect(() => {
		if (controllerRef.current) {
			if (seconds === 0) {
				seconds = 0.1;
			}
			
			if (hasStartedBool.current) {
				controllerRef.current.seek(seconds);
			} else {
				controllerRef.current.play();
			
				setTimeout(() => {
					controllerRef.current.seek(seconds);
				}, 500);
			}
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
