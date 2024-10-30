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

const getCardHTML = (card) => {
	const isNew = isItemNew(card.date);

	return `
        <a class="article-card-image" href="details/${card.id}">
            ${isNew ? '<p class="new-item">Nyhet</p>' : ""}
            <img src="${card.imageUrl}" alt="${card.title}" class="full" />
        </a>
        <a class="article-card-icon" href="#">
            <svg class="icon icon-medium" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
            </svg>
        </a>
        <div class="item-details">
            <h3>${card.title}</h3>
            <span>${card.price}</span>
        </div>
        <span>${card.brand}</span>
    `;
};

const isItemNew = (dateString) => {
	const itemDate = new Date(dateString);
	const today = new Date();
	const dayDifference = (today - itemDate) / (1000 * 60 * 60 * 24);
	return dayDifference <= 7;
};

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
