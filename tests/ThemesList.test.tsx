import { render, screen } from "@testing-library/react";
import { mock } from "jest-mock-extended";

import { ApiThemeRepository } from "../src/infrastructure/ApiThemeRepository";
import { ThemesList } from "../src/sections/ThemesList/ThemesList";
import { ThemeMother } from "./ThemeMother";

jest.mock("../src/infrastructure/ApiThemeRepository");
const mockRepository = mock<ApiThemeRepository>();

describe("ThemesList", () => {
	it("renders themes correctly", async () => {
		const theme1 = ThemeMother.create();
		const theme2 = ThemeMother.create();

		mockRepository.searchAll.mockResolvedValue([theme1, theme2]);

		render(<ThemesList repository={mockRepository} />);

		// Check if themes are rendered
		expect(await screen.findByText(theme1.name)).toBeInTheDocument();
		expect(screen.getByText(theme2.name)).toBeInTheDocument();
	});
});
