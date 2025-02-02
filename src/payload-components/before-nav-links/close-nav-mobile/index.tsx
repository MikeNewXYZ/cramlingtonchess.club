"use client";
import { Fragment, useEffect } from "react";
import { useNav, useWindowInfo } from "@payloadcms/ui";
import { usePathname } from "next/navigation";

function CloseNavMobile() {
	const {
		breakpoints: { s: smallBreak },
	} = useWindowInfo();
	const { setNavOpen } = useNav();
	const pathname = usePathname();

	useEffect(() => {
		if (smallBreak) {
			setNavOpen(false);
		}
	}, [smallBreak, pathname]);

	return <Fragment />;
}

export { CloseNavMobile };
