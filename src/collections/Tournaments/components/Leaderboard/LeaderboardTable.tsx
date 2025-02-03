"use client";
import {
	Cell,
	Column,
	Row,
	Table,
	TableBody,
	TableContainer,
	TableHeader,
} from "@/payload-components/ui/Table";

type LeaderboardEntry = {
	playerTitle: string;
	score: number;
};

function LeaderboardTable({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
	return (
		<TableContainer>
			<Table aria-label="Files">
				<TableHeader>
					<Column>Rank</Column>
					<Column isRowHeader>Player</Column>
					<Column>Score</Column>
				</TableHeader>
				<TableBody>
					{leaderboard.map(({ playerTitle, score }, index) => (
						<Row key={`${playerTitle}-${score}`}>
							<Cell className="font-bold">{index + 1}</Cell>
							<Cell>{playerTitle}</Cell>
							<Cell>{score.toFixed(1)} pts</Cell>
						</Row>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export { LeaderboardTable };
export type { LeaderboardEntry };
