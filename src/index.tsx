import "./assets/styles/global.css";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { HeroUIProvider } from "@heroui/react";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<HeroUIProvider>
			<App />
		</HeroUIProvider>
	</React.StrictMode>
);
