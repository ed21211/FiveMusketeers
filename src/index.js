import express from 'express';
const app = express();
import buyer from './routes/buyerRoutes.js';

app.use(express.json());
app.use('/buyer', buyer);


const PORT = 5000;

app.get("/", (req, res) => {
	res.json({ message: "Hello World"  });
})


app.listen(PORT, () => {
	console.log("Server Running on PORT", PORT);
})

