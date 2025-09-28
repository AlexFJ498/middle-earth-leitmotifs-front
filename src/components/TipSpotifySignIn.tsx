export function TipSpotifySignIn() {
	return (
		<p className="mt-4 mx-auto max-w-2xl text-sm leading-relaxed text-foreground/75 text-center">
			Tip: For the best playback experience, sign in to Spotify in this browser.{" "}
			<a
				href="https://accounts.spotify.com/login"
				target="_blank"
				rel="noopener noreferrer"
				className="underline underline-offset-2 text-[var(--color-gold-soft)] hover:text-[var(--color-gold-bright)]"
			>
				Sign in
			</a>
		</p>
	);
}
