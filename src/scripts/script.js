let currentSearchQuery = "";
let cards = [];
const cardContainer = document.querySelector(".article-cards");
const searchInput = document.querySelector("input[type='search']");

searchInput.addEventListener("input", () => {
	currentSearchQuery = searchInput.value;
	updateVisibleCards(currentSearchQuery);
});

window.addEventListener("resize", () => {
	updateVisibleCards(currentSearchQuery);
});

const updateVisibleCards = (searchQuery = "") => {
	if (typeof searchQuery !== "string") {
		console.error("searchQuery is not a string:", searchQuery);
		searchQuery = "";
	}

	const maxCardsToShow =
		searchQuery === "" ? cards.length : window.innerWidth < 640 ? 4 : cards.length;

	cardContainer.innerHTML = "";

	const filteredCards = cards.filter(
		(card) =>
			card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			card.brand.toLowerCase().includes(searchQuery.toLowerCase())
	);

	filteredCards.slice(0, maxCardsToShow).forEach((card) => {
		const cardElement = document.createElement("div");
		cardElement.innerHTML = getCardHTML(card);
		cardContainer.appendChild(cardElement);
	});
};

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const response = await fetch("/api/cards");
		cards = await response.json();

		const today = new Date();
		cards = cards.filter((card) => new Date(card.date) <= today);

		updateVisibleCards(currentSearchQuery);
	} catch (error) {
		console.error("Error fetching cards:", error);
	}
});
