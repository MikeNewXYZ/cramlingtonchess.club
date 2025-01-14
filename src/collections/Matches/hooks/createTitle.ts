import type { FieldHook } from "payload";

export const createTitle: FieldHook = async ({ data, req: { payload } }) => {
	if (!data?.playerOne || !data?.playerTwo) return "Player(s) Missing";

	const playerOne = await payload.findByID({
		id: data?.playerOne as string | number,
		collection: "players",
	});

	const playerTwo = await payload.findByID({
		id: data?.playerTwo as string | number,
		collection: "players",
	});

	const createResultText = (result: string) => {
		if (result === "playerOneWin") return `Winner: ${playerOne.title} 🎉`;
		if (result === "playerTwoWin") return `Winner: ${playerTwo.title} 🎉`;
		if (result === "draw") return `Result: Draw 🤝`;
		return `Result: Undefined 🤔`;
	};

	return `⚔️ ${playerOne.title} VS ${playerTwo.title} | ${createResultText(data?.result)}`;
};
