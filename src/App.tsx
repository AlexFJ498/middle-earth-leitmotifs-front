import { ApiThemeRepository } from "./infrastructure/ApiThemeRepository";
import { ThemesList } from "./sections/ThemesList/ThemesList";

const themeRepository = new ApiThemeRepository();

export function App() {

	return <ThemesList repository={themeRepository} />;
}
