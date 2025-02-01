"use client";
import Image from "next/image";
import brandLogoForLight from "@/assets/Brand/BrandLogoForLight.png";
import brandLogoForDark from "@/assets/Brand/BrandLogoForDark.png";
import { useTheme } from "@payloadcms/ui";

function BrandLogo() {
	const { theme } = useTheme();

	return (
		<>
			{theme === "light" ? (
				<Image src={brandLogoForLight} alt="logo" priority />
			) : (
				<Image src={brandLogoForDark} alt="logo" priority />
			)}
		</>
	);
}

export { BrandLogo };
