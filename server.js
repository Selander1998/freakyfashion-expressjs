require("dotenv").config();

const express = require("express");
const path = require("path");
const db = require("./src/scripts/db");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

const getAllCards = async () => {
	const [result] = await db.query("SELECT * FROM cards");
	return result;
};

const isItemNew = (dateString) => {
	const itemDate = new Date(dateString);
	const today = new Date();
	const dayDifference = (today - itemDate) / (1000 * 60 * 60 * 24);
	return dayDifference <= 7;
};

app.get("/", async (_, res) => {
	try {
		const cards = await getAllCards();
		cards.forEach((card) => {
			card.isNew = isItemNew(card.date);
		});
		res.render(path.join(__dirname, "src/views", "index.ejs"), { cards });
	} catch (err) {
		console.error(err);
		res.status(500).send("Database Error");
	}
});

app.get("/search", async (req, res) => {
	const searchQuery = req.query.q;
	const [cards] = await db.query(`SELECT * FROM cards WHERE title LIKE ?`, [`%${searchQuery}%`]);

	res.render(path.join(__dirname, "src/views", "search.ejs"), { cards, amount: cards.length });
});

app.get("/checkout", (_, res) => {
	res.render(path.join(__dirname, "src/views", "checkout.ejs"));
});

app.get("/details", (_, res) => {
	res.render(path.join(__dirname, "src/views", "details.ejs"));
});

app.get("/admin/products", (_, res) => {
	res.render(path.join(__dirname, "src", "/admin/products/index.ejs"));
});

app.get("/admin/products/new", (_, res) => {
	res.render(path.join(__dirname, "src", "/admin/products/new.ejs"));
});

app.get("/products/:product", async (req, res) => {
	const cards = await getAllCards();
	const slug = req.params.product;

	if (!slug) {
		res.status(500).send("Invalid slug url");
		return;
	}

	const article = cards.find((card) => card.slug === slug);

	if (!article) {
		res.status(500).send("Invalid article url");
		return;
	}

	res.render(path.join(__dirname, "src/views", "/products/details.ejs"), { cards, article });
});

app.get("/api/products/:product", (req, res) => {
	const productSlug = req.query.product;
	const product = cards.find((x) => x.slug === productSlug);
	if (!product) {
		return res.status(404).send();
	}
	res.send(product);
});

app.get("/api/cards", async (_, res) => {
	const cards = await getAllCards();
	res.json(cards);
});

app.delete("/api/cards/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await db.query("DELETE FROM `cards` WHERE `id` = ?", [id]);

		if (result) {
			res.status(200).json({ message: "Product deleted successfully" });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

function formatToSlug(name) {
	return name.trim().toLowerCase().replace(/\s+/g, "-");
}

app.post("/api/cards/create", async (req, res) => {
	const item = req.body;
	const slug = formatToSlug(item.name);
	const query = `INSERT INTO cards (
		slug,
		title,
		price,
		brand,
		imageUrl,
		date,
		description,
		sku
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
	const values = [
		slug,
		item.name,
		`${item.price}kr`,
		item.brand,
		item.image,
		item.publishingDate,
		item.description,
		item.sku,
	];
	const [result] = await db.execute(query, values);
	console.log(result);

	console.log("adding new item :)");
	console.log(req.body.name);
	res.render(path.join(__dirname, "src", "/admin/products/index.ejs"));
});

app.listen(PORT, () => {
	console.log(`Server is running on http://${process.env.HOST}:${PORT}`);
});
