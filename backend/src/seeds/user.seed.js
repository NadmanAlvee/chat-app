import { config } from "dotenv";
import { connectDB } from "../lib/mongodb.config.js";
import User from "../models/user.model.js";

// config({
// 	path: "../../",
// });

const seedUsers = [
	{
		email: "james.anderson@example.com",
		fullname: "James Anderson",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/lego/1.jpg",
	},
	{
		email: "william.clark@example.com",
		fullname: "William Clark",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/lego/2.jpg",
	},
	{
		email: "benjamin.taylor@example.com",
		fullname: "Benjamin Taylor",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/lego/3.jpg",
	},
	{
		email: "lucas.moore@example.com",
		fullname: "Lucas Moore",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/lego/4.jpg",
	},
	{
		email: "henry.jackson@example.com",
		fullname: "Henry Jackson",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/lego/5.jpg",
	},
	{
		email: "alexander.martin@example.com",
		fullname: "Alexander Martin",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/lego/6.jpg",
	},
	{
		email: "daniel.rodriguez@example.com",
		fullname: "Daniel Rodriguez",
		password: "123456",
		profilePic: "https://randomuser.me/api/portraits/lego/7.jpg",
	},
];

const seedDatabase = async () => {
	try {
		await connectDB();

		await User.insertMany(seedUsers);
		console.log("Database seeded successfully");
	} catch (error) {
		console.error("Error seeding database:", error);
	}
};

// Call the function
seedDatabase();
