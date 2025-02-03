import type { ServerComponentProps } from "payload";
import type { Player, Tournament } from "@/payload-types";
import type { LeaderboardEntry } from "./LeaderboardTable";
import { LeaderboardTable } from "./LeaderboardTable";

type Match = {
	id: string;
	playerOne: Player;
	playerTwo: Player;
	outcome?: ("playerOneWins" | "playerTwoWins" | "draw") | null;
};

function formatLeaderboardResults(
	leaderboard: Map<number, { player: Player; score: number }>,
): LeaderboardEntry[] {
	return Array.from(leaderboard.values())
		.sort((a, b) => b.score - a.score)
		.map(({ player, score }) => ({
			playerTitle: player.title,
			score: Number(score.toFixed(1)),
		}));
}

function calculateLeaderboard(matches: Match[]): LeaderboardEntry[] {
	const leaderboard = new Map<number, { player: Player; score: number }>();

	for (const match of matches) {
		const { playerOne, playerTwo, outcome } = match;
		if (!outcome) continue;

		if (!leaderboard.has(playerOne.id)) {
			leaderboard.set(playerOne.id, { player: playerOne, score: 0 });
		}
		if (!leaderboard.has(playerTwo.id)) {
			leaderboard.set(playerTwo.id, { player: playerTwo, score: 0 });
		}

		const playerOneEntry = leaderboard.get(playerOne.id)!;
		const playerTwoEntry = leaderboard.get(playerTwo.id)!;

		switch (outcome) {
			case "playerOneWins":
				playerOneEntry.score += 1;
				break;
			case "playerTwoWins":
				playerTwoEntry.score += 1;
				break;
			case "draw":
				playerOneEntry.score += 0.5;
				playerTwoEntry.score += 0.5;
				break;
		}
	}

	return formatLeaderboardResults(leaderboard);
}

type LeaderboardProps = Omit<ServerComponentProps, "data"> & {
	data: Tournament;
};

async function Leaderboard({ data, operation, req: { payload } }: LeaderboardProps) {
	if (operation === "create") return;

	const tournament = await payload.findByID({
		collection: "tournaments",
		id: data.id,
		depth: 2,
	});

	const leaderboard = calculateLeaderboard(tournament.matches as Match[]);

	return <LeaderboardTable leaderboard={leaderboard} />;
}

export { Leaderboard };
