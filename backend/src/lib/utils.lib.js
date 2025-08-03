import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
	const jwtToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie(process.env.COOKIE_NAME, jwtToken, {
		maxAge: 7 * 24 * 60 * 60 * 1000, //ms
		httpOnly: true,
		sameSite: "lax",
		// secure: process.env.NODE_ENV === "production",
		secure: false,
	});

	return jwtToken;
};
