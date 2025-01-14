import { RelationshipFieldSingleValidation } from "payload";

export const isPlayerInTournament: RelationshipFieldSingleValidation = async (
	value,
	{ data, req: { payload } },
) => {
	const { tournament }: { tournament?: number } = data;

	if (tournament) {
		const tournamentData = await payload.findByID({
			id: tournament,
			collection: "tournaments",
		});

		const playerInTournament = tournamentData.players.filter((player) => {
			const playerID = typeof player === "number" ? player : player.id;
			return playerID === value;
		});

		if (playerInTournament.length <= 0) {
			return `That player is not in ${tournamentData.name} tournament.`;
		}
	}

	return true;
};
