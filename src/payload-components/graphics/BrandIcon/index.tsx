"use client";
import Image from "next/image";
import brandIconForLight from "@/assets/Brand/BrandIconForLight.png";
import brandIconForDark from "@/assets/Brand/BrandIconForDark.png";
import { useTheme } from "@payloadcms/ui";

function BrandIcon() {
	const { theme } = useTheme();

	return (
		<>
			{theme === "light" ? (
				<Image src={brandIconForLight} alt="logo" priority />
			) : (
				<Image src={brandIconForDark} alt="logo" priority />
			)}
		</>
	);
}

export { BrandIcon };
