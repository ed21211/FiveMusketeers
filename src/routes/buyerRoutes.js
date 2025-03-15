import express from 'express';
const buyer = express.Router();

const users = [];

buyer.post("/login", (req, res) => {
	const { user } = req.body;
	users.push({ email: user.email });

	console.log(users);
	res.json({ loggedin: true, status: "Welcome to the 5Musks Order Creation!" });
});

buyer.get("/users", (_, res) => {
	res.json(users);
})

buyer.put("/update",  (req,res) => {

})

buyer.delete("/delete",  (req,res) => {
	const { user } = req.body;
	const existingUser = users.find(u => u.email);
	console.log(existingUser);

	if (!existingUser) {
		res.statusCode(401).json({errorStatus: "Credentials did not match"});
	};

	users.splice(users.indexOf(existingUser), 1);
	res.json(users);
	
})

export default buyer;