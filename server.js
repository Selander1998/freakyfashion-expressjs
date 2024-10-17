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

app.get("/new", (_, res) => {
	res.sendFile(path.join(__dirname, "src", "new.html"));
});

app.listen(PORT, () => {
	console.log(`Server is running on http://192.168.0.6:${PORT}`);
});
