import { CollectionAfterChangeHook } from "payload";

export const populateMatches: CollectionAfterChangeHook = async ({
	doc,
	operation,
	req: { payload },
}) => {
	const { players, id }: { players?: number[]; id: number } = doc;

	if (operation === "update") return;
	if (!players) return;

	for (let x = 0; x < players.length; x++) {
		for (let y = x + 1; y < players.length; y++) {
			await payload.create({
				collection: "matches",
				data: {
					title: "",
					playerOne: players[x],
					playerTwo: players[y],
					tournament: id,
				},
			});
		}
	}
};
