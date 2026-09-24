import { act, render } from "@testing-library/react";

import SpotifyEmbed from "../src/components/SpotifyIFrame";

const trackId = "7DbCJTrxSN3EKgLuWJt4Cb";
const trackUri = `spotify:track:${trackId}`;

function spotifyApi() {
	const controller = {
		addListener: jest.fn(),
		loadUri: jest.fn(),
		play: jest.fn(),
	};
	const api = {
		createController: jest.fn(
			(
				_element: HTMLDivElement,
				_options: { uri: string; width: string; height: string },
				onReady: (player: typeof controller) => void
			) => {
				onReady(controller);
			}
		),
	};

	return { api, controller };
}

afterEach(() => {
	window.onSpotifyIframeApiReady = undefined;
	window.SpotifyIframeApi = undefined;
});

test.each([
	["ordinary", `https://open.spotify.com/track/${trackId}?si=share`],
	["localized", `https://open.spotify.com/intl-es/track/${trackId}?si=share`],
	["canonical", trackUri],
])("creates a controller with a canonical URI for a %s track link", (_kind, link) => {
	const { api } = spotifyApi();
	render(<SpotifyEmbed uri={link} />);

	act(() => window.onSpotifyIframeApiReady?.(api));

	expect(api.createController).toHaveBeenCalledWith(
		expect.any(HTMLDivElement),
		{ uri: trackUri, width: "100%", height: "152" },
		expect.any(Function)
	);
});

test("loads a canonical URI when a different track is selected", () => {
	const { api, controller } = spotifyApi();
	const { rerender } = render(<SpotifyEmbed uri={`https://open.spotify.com/track/${trackId}`} />);
	act(() => window.onSpotifyIframeApiReady?.(api));

	const nextId = "0VjIjW4GlUZAMYd2vXMi3b";
	rerender(<SpotifyEmbed uri={`https://open.spotify.com/intl-es/track/${nextId}?si=share`} />);

	expect(controller.loadUri).toHaveBeenCalledWith(`spotify:track:${nextId}`);
});

test("creates a controller when a valid link arrives after the API is ready", () => {
	const { api } = spotifyApi();
	const { rerender } = render(<SpotifyEmbed uri="" />);
	act(() => window.onSpotifyIframeApiReady?.(api));

	rerender(<SpotifyEmbed uri={`https://open.spotify.com/intl-es/track/${trackId}`} />);

	expect(api.createController).toHaveBeenCalledWith(
		expect.any(HTMLDivElement),
		{ uri: trackUri, width: "100%", height: "152" },
		expect.any(Function)
	);
});

test.each([
	"not a Spotify link",
	`https://example.com/track/${trackId}`,
	`https://open.spotify.com/album/${trackId}`,
	"https://open.spotify.com/intl-es/track/not-an-id",
])("does not send invalid input to the API: %s", (link) => {
	const { api, controller } = spotifyApi();
	const { rerender } = render(<SpotifyEmbed uri={link} />);
	act(() => window.onSpotifyIframeApiReady?.(api));
	expect(api.createController).not.toHaveBeenCalled();

	rerender(<SpotifyEmbed uri={`https://open.spotify.com/track/${trackId}`} />);
	expect(api.createController).toHaveBeenCalledTimes(1);

	rerender(<SpotifyEmbed uri={link} />);
	expect(controller.loadUri).not.toHaveBeenCalled();
});
