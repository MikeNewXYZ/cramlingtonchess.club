import type { UIFieldServerComponent } from "payload";
import type { Player } from "@/payload-types";

interface RawMatch {
	playerOne: number;
	playerTwo: number;
	outcome: "playerOneWins" | "playerTwoWins" | "draw" | null;
}

interface ProcessedMatch {
	playerOne: Player;
	playerTwo: Player;
	outcome: RawMatch["outcome"];
}

interface LeaderboardEntry {
	playerTitle: string;
	score: number;
}

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

function calculateLeaderboard(matches: ProcessedMatch[]): LeaderboardEntry[] {
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

const MatchLeaderboard: UIFieldServerComponent = async ({ data, req: { payload } }) => {
	if (!data?.players) return;
	if (!data?.matches) return;

	const playerIds = (data.players as number[]) || [];
	const rawMatches = (data.matches as RawMatch[]) || [];

	const playersResult = await payload.find({
		collection: "players",
		where: { id: { in: playerIds.join(",") } },
		limit: 100,
	});

	const playerMap = playersResult.docs.reduce(
		(acc, player) => {
			acc[player.id] = player;
			return acc;
		},
		{} as Record<number, Player>,
	);

	const processedMatches = rawMatches.map((match) => ({
		...match,
		playerOne: playerMap[match.playerOne],
		playerTwo: playerMap[match.playerTwo],
	}));

	const leaderboard = calculateLeaderboard(processedMatches);

	return (
		<ol className="flex w-full flex-col gap-6 overflow-x-hidden text-3xl">
			{leaderboard.map(({ playerTitle, score }, index) => (
				<li key={`${playerTitle}-${score}`} className="flex gap-4">
					<span>{index + 1}.</span>
					<span className="break-all font-bold">{playerTitle}</span>
					<span>{score.toFixed(1)} pts</span>
				</li>
			))}
		</ol>
	);
};

export { MatchLeaderboard };
