import getBooks from "../source.js";

document.addEventListener("DOMContentLoaded", async () => {
	// Function to fetch the JSON asynchronously
	async function fetchCategories(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}
			const categories = await response.json();
			return categories;
		} catch (error) {
			console.error(error);
		}
	}

	const categories = await fetchCategories("../json/categories.json");

	// Function to handle button click for viewing more/less books
	const handleViewButtonClick = async (btn) => {
		const categoryName = btn.classList[0];
		let i = categories.findIndex((c) => c.name === categoryName);
		const more = categories[i].viewMore;
		categories[i].viewMore = !more;
		btn.textContent = more ? "View All" : "View Less";

		const section = document.getElementById(categoryName);
		section.removeChild(document.getElementById(categoryName + "Cards"));

		const maxResults = more ? 5 : 40;
		const books = await getBooks(
			`../json/${categoryName}.json`,
			maxResults,
			categoryName
		);
		section.appendChild(books);
	};

	// Render initial set of books for each category
	for (let category of categories) {
		const cardDeck = await getBooks(
			`../json/${category.name}.json`,
			5,
			category.name
		);
		document.getElementById(category.name).appendChild(cardDeck);
	}

	// Add event listeners to view buttons
	const viewButtons = document.querySelectorAll(".view-btn");
	viewButtons.forEach((btn) => {
		btn.addEventListener("click", () => handleViewButtonClick(btn));
	});
});
