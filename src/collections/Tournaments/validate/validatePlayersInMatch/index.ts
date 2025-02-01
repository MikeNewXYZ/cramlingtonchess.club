import type { RelationshipFieldValidation } from "payload";
import { relationship } from "payload/shared";

const validatePlayersInMatch: RelationshipFieldValidation = (value, args) => {
	const { data, siblingData } = args;
	const tournamentsPlayers = (data as { players: unknown[] }).players;
	const matchPlayerOne = (siblingData as { playerOne?: number })?.playerOne;
	const matchPlayerTwo = (siblingData as { playerTwo?: number })?.playerTwo;

	if (!value) return "Player field can not be empty.";
	if (!tournamentsPlayers.includes(value)) return "Player is not registered in this tournament.";
	if (matchPlayerOne === matchPlayerTwo) return "Must select different players.";

	return relationship(value, args);
};

export { validatePlayersInMatch };
