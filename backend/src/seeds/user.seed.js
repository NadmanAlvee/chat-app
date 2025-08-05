import { config } from "dotenv";
import path from "path";
import { connectDB } from "../lib/mongodb.config.js";
import User from "../models/user.model.js";

config({ path: path.join(path.resolve(), "/backend", ".env") });

const fetchProfilePic = async () => {
	try {
		const res = await fetch("https://api.nekosapi.com/v4/images/random");
		let data = await res.json();
		console.log(data);
		return data[0].url;
	} catch (error) {
		console.log("Error fetching image:", error.message);
		return "https://defaultimage.com/default.jpg";
	}
};

const users = [
	{ email: "kakashi@yahoo.com", fullname: "Kakashi Hatake" },
	{ email: "naruto@yahoo.com", fullname: "Naruto Uzumaki" },
	{ email: "sakura@yahoo.com", fullname: "Sakura Haruno" },
	{ email: "sasuke@yahoo.com", fullname: "Sasuke Uchiha" },
	{ email: "goku@yahoo.com", fullname: "Goku" },
	{ email: "luffy@yahoo.com", fullname: "Monkey D. Luffy" },
	{ email: "eren@yahoo.com", fullname: "Eren Yeager" },
];

const seedDatabase = async () => {
	console.log("Seeding from:", path.join(path.resolve(), "/backend"));

	try {
		await connectDB();

		const seedUsers = await Promise.all(
			users.map(async (user) => ({
				...user,
				password:
					"$2b$10$.SnLeU7vTfjMPXTL85TdsOAWfaIU3JvbgUGxHqjiGY.vPe8RAiR8.",
				profilePic: await fetchProfilePic(),
			}))
		);

		await User.insertMany(seedUsers);
		console.log("✅ Database seeded successfully");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
	}
};

seedDatabase();
