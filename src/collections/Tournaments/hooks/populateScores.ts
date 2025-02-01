import { CollectionAfterChangeHook } from "payload";

export const populateScores: CollectionAfterChangeHook = async ({
	doc,
	operation,
	req: { payload },
}) => {
	const { players, id }: { players?: number[]; id: number } = doc;

	if (operation === "update") return;
	if (!players) return;

	players.forEach(async (playerID) => {
		await payload.create({
			collection: "scores",
			data: {
				player: playerID,
				tournament: id,
				totalPoints: 0,
			},
		});
	});
};
