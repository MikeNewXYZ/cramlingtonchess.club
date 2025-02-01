"use client";
import type { Player } from "@/payload-types";
import { useRowLabel } from "@payloadcms/ui";
import useSWR from "swr";

type MatchItem = {
	id: string;
	playerOne?: string | number;
	playerTwo?: string | number;
	outcome?: "playerOneWins" | "playerTwoWins" | "draw";
};

const MESSAGES = {
	playersNotSet: "Players Not Set",
	error: "Error loading player data",
	loading: "Loading...",
	pending: "Pending...",
	draw: "DRAW",
} as const;

const OUTCOME_MAP: Record<NonNullable<MatchItem["outcome"]>, string> = {
	playerOneWins: "wins!",
	playerTwoWins: "wins!",
	draw: MESSAGES.draw,
};

const fetcher = async (url: string): Promise<Player> => {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch player");
	return res.json();
};

const useGetPlayerData = (id?: string | number) => {
	const { data, error, isLoading } = useSWR<Player, Error>(
		id ? `/api/players/${id}` : null,
		fetcher,
	);
	return { player: data, error, isLoading };
};

const getOutcomeText = (
	outcome?: MatchItem["outcome"],
	playerOne?: string,
	playerTwo?: string,
): string => {
	if (!outcome) return MESSAGES.pending;
	if (outcome === "draw") return MESSAGES.draw;

	const winningPlayer = outcome === "playerOneWins" ? playerOne : playerTwo;
	const resultSuffix = OUTCOME_MAP[outcome];

	return `${winningPlayer} ${resultSuffix}`;
};

function MatchesRowLabel() {
	const { data: match } = useRowLabel<MatchItem>();
	const { playerOne, playerTwo, outcome } = match;

	const { player: p1, error: e1, isLoading: l1 } = useGetPlayerData(playerOne);
	const { player: p2, error: e2, isLoading: l2 } = useGetPlayerData(playerTwo);

	if (!playerOne || !playerTwo) return <div>{MESSAGES.playersNotSet}</div>;
	if (e1 || e2) return <div>{MESSAGES.error}</div>;
	if (l1 || l2 || !p1 || !p2) return <div>{MESSAGES.loading}</div>;

	const playerNames = `${p1.title} VS ${p2.title}`;
	const outcomeText = getOutcomeText(outcome, p1.title, p2.title);

	return <div>{`${playerNames} | Outcome: ${outcomeText}`}</div>;
}

export { MatchesRowLabel };
