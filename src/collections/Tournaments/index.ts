import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { anyone } from "@/access/anyone";
import { validatePlayersInMatch } from "./validate/validatePlayersInMatch";

export const Tournaments: CollectionConfig<"tournaments"> = {
	slug: "tournaments",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: anyone,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["name", "players"],
		useAsTitle: "name",
		group: "Chess",
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Settings",
					fields: [
						{
							name: "name",
							type: "text",
							minLength: 1,
							maxLength: 100,
							required: true,
						},
						{
							name: "players",
							type: "relationship",
							relationTo: "players",
							required: true,
							hasMany: true,
						},
					],
				},
				{
					label: "Matches",
					fields: [
						{
							name: "matches",
							type: "array",
							admin: {
								initCollapsed: true,
								components: {
									RowLabel: {
										path: "@/collections/Tournaments/components/MatchesRowLabel",
										exportName: "MatchesRowLabel",
									},
								},
							},
							fields: [
								{
									type: "row",
									fields: [
										{
											name: "playerOne",
											type: "relationship",
											relationTo: "players",
											required: true,
											hasMany: false,
											validate: validatePlayersInMatch,
										},
										{
											name: "playerTwo",
											type: "relationship",
											relationTo: "players",
											required: true,
											hasMany: false,
											validate: validatePlayersInMatch,
										},
									],
								},
								{
									name: "outcome",
									type: "select",
									options: [
										{ label: "Player One Wins", value: "playerOneWins" },
										{ label: "Player Two Wins", value: "playerTwoWins" },
										{ label: "Draw", value: "draw" },
									],
								},
							],
						},
					],
				},
				{
					label: "Leaderboard",
					fields: [
						{
							name: "leaderboard",
							type: "ui",
							admin: {
								components: {
									Field: {
										path: "@/collections/Tournaments/components/Leaderboard",
										exportName: "Leaderboard",
									},
								},
							},
						},
					],
				},
			],
		},
	],
};
