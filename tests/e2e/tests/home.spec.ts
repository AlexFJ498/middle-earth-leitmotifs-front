describe("The Home Page", () => {
	it("successfully loads", () => {
		cy.visit("/");
		cy.findByRole("heading", {
			name: /Middle-earth Leitmotifs/i,
		}).should("exist");
	});
});
