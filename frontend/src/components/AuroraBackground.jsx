import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AuroraBlob = ({ color, top, left, width, height }) => {
	return (
		<motion.div
			className={`absolute ${color} opacity-40 mix-blend-normal`}
			style={{
				top,
				left,
				width,
				height,
				borderRadius: "50%",
				filter: "blur(100px)",
			}}
			aria-hidden="true"
		/>
	);
};

export default function AuroraBackground() {
	const [isSmall, setIsSmall] = useState(false);

	useEffect(() => {
		const checkSize = () => setIsSmall(window.innerWidth < 664);
		checkSize();
		window.addEventListener("resize", checkSize);
		return () => window.removeEventListener("resize", checkSize);
	}, []);

	return (
		<div className="h-screen absolute inset-0 bg-base-100 overflow-hidden z-5">
			<AuroraBlob
				color="bg-primary"
				top="-10%"
				left="-10%"
				width={isSmall ? "25rem" : "50rem"}
				height={isSmall ? "25rem" : "50rem"}
			/>
			<AuroraBlob
				color="bg-secondary"
				top="70%"
				left="10%"
				width={isSmall ? "25rem" : "35rem"}
				height={isSmall ? "25rem" : "35rem"}
			/>
			<AuroraBlob
				color="bg-info"
				top="10%"
				left="70%"
				width={isSmall ? "25rem" : "45rem"}
				height={isSmall ? "25rem" : "45rem"}
			/>
		</div>
	);
}
