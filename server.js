require("dotenv").config();

const express = require("express");
const path = require("path");
const db = require("./src/scripts/db");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "src")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

const isItemNew = (dateString) => {
	const itemDate = new Date(dateString);
	const today = new Date();
	const dayDifference = (today - itemDate) / (1000 * 60 * 60 * 24);
	return dayDifference <= 7;
};

app.get("/", async (_, res) => {
	try {
		const [cards] = await db.query("SELECT * FROM cards");
		cards.forEach((card) => {
			card.isNew = isItemNew(card.date);
		});
		res.render(path.join(__dirname, "src/views", "index.ejs"), { cards });
	} catch (err) {
		console.error(err);
		res.status(500).send("Database Error");
	}
});

app.get("/checkout", (_, res) => {
	res.render(path.join(__dirname, "src/views", "checkout.hejstml"));
});

app.get("/details", (_, res) => {
	res.render(path.join(__dirname, "src/views", "details.ejs"));
});

app.get("/admin/products/new", (_, res) => {
	res.sendFile(path.join(__dirname, "src", "/admin/products/new.html"));
});

app.get("/products/:product", (_, res) => {
	res.sendFile(path.join(__dirname, "src", "/products/details.html"));
});

app.listen(PORT, () => {
	console.log(`Server is running on http://${process.env.HOST}:${PORT}`);
});

app.get("/api/products/:product", (req, res) => {
	const productSlug = req.query.product;
	const product = cards.find((x) => x.slug === productSlug);
	if (!product) {
		return res.status(404).send();
	}
	res.send(product);
});
