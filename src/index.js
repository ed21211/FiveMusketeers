const express = require('express');
const pool = require('./db.js');
const buyer = require('./routes/buyerRoutes.js');
const seller = require('./routes/sellerRoutes.js');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/buyer', buyer);
app.use('/seller', seller);

app.get("/", (req, res) => {
	res.json({ message: "Hello World"  });
})


app.listen(PORT, () => {
	console.log("Server Running on PORT", PORT);
})

