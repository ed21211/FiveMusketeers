import express from 'express';
import buyer from './routes/buyerRoutes.js';
import seller from './routes/sellerRoutes.js';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/buyer', buyer);
app.use('/seller', seller);

app.get("/", (req, res) => {
	res.json({ message: "Welcome to FiveMusketeer's Order Creation API"  });
})


app.listen(PORT, () => {
	console.log("Server Running on PORT", PORT);
})

