import { Analytics } from "@vercel/analytics/react";

import { Router } from "./Router";

export function App() {
	return (
		<>
			<Router />
			<Analytics />
		</>
	);
}
