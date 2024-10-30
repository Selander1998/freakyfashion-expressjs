const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "src")));

app.get("/", (_, res) => {
	res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/checkout", (_, res) => {
	res.sendFile(path.join(__dirname, "src", "checkout.html"));
});

app.get("/details", (_, res) => {
	res.sendFile(path.join(__dirname, "src", "details.html"));
});

app.get("/admin/products/new", (_, res) => {
	res.sendFile(path.join(__dirname, "src", "/admin/products/new.html"));
});

app.listen(PORT, () => {
	console.log(`Server is running on http://192.168.0.6:${PORT}`);
});

app.get("/api/cards", (_, res) => {
	const cards = [
		{
			id: 1,
			title: "Svart T-Shirt",
			price: "199kr",
			brand: "Gant",
			imageUrl: "https://placehold.co/150x200",
			date: "2024-10-25",
		},
		{
			id: 2,
			title: "Vit T-Shirt",
			price: "199kr",
			brand: "Gant",
			imageUrl: "https://placehold.co/150x200",
			date: "2024-10-26",
		},
		{
			id: 3,
			title: "Blå T-Shirt",
			price: "199kr",
			brand: "Gant",
			imageUrl: "https://placehold.co/150x200",
			date: "2024-10-27",
		},
		{
			id: 4,
			title: "Grön T-Shirt",
			price: "199kr",
			brand: "Gant",
			imageUrl: "https://placehold.co/150x200",
			date: "2024-10-28",
		},
		{
			id: 5,
			title: "Lila T-Shirt",
			price: "199kr",
			brand: "Gant",
			imageUrl: "https://placehold.co/150x200",
			date: "2024-10-29",
		},
		{
			id: 6,
			title: "Rosa T-Shirt",
			price: "199kr",
			brand: "Gant",
			imageUrl: "https://placehold.co/150x200",
			date: "2024-10-30",
		},
		{
			id: 7,
			title: "Orange T-Shirt",
			price: "199kr",
			brand: "Gant",
			imageUrl: "https://placehold.co/150x200",
			date: "2024-10-31",
		},
		{
			id: 8,
			title: "Röd T-Shirt",
			price: "199kr",
			brand: "Gant",
			imageUrl: "https://placehold.co/150x200",
			date: "2024-12-24",
		},
	];
	res.json(cards);
});
