import getBooks from "../source.js";

document.addEventListener("DOMContentLoaded", async () => {
	async function fetchCategories(url) {
		try {
			const response = await fetch(url); // Replace 'categories.json' with the path to your JSON file
			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}
			const categories = await response.json();
			return categories;
		} catch (error) {
			console.error(error);
		}
	}

	// Usage example
	const categories = await fetchCategories("../json/categories.json");
	console.log(categories);

	const searchInput = document.getElementById("searchInput");
	const filterSelect = document.getElementById("filter");
	const searchBtn = document.getElementById("searchBtn");

	// Function to display search results
	const displayResults = async () => {
		const searchQuery = searchInput.value.trim();
		const selectedCategory = filterSelect.value;
		const maxResults = 40; // Adjust the maximum number of results as needed
		const categoryName = selectedCategory || "featured"; // Default to 'featured' if no category is selected
		const bookSection = document.getElementById("bookSection");
		if (searchQuery === "") {
			bookSection.innerHTML = `
				<h3>Search something to get results</h3>
			`;
		} else {
			// Clear previous search results
			bookSection.innerHTML = "";
			let i = categories.findIndex((c) => c.name === categoryName);

			// Call getBooks function and display results
			const cardDeck = await getBooks(
				categories[i].url,
				maxResults,
				categoryName,
				searchQuery
			);
			bookSection.appendChild(cardDeck);
		}
	};

	// Event listener for search button click
	searchBtn.addEventListener("click", displayResults);

	// Event listener for Enter key press in search input
	searchInput.addEventListener("keypress", (event) => {
		if (event.key === "Enter") {
			displayResults();
		}
	});

	// Event listener for filter select change
	filterSelect.addEventListener("change", displayResults);
});
