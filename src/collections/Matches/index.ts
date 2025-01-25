import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { anyone } from "@/access/anyone";
import { createTitle } from "./hooks/createTitle";
import { isPlayerInTournament } from "./validate/isPlayerInTournament";
import { calculateScore } from "./hooks/calculateScore";

export const Matches: CollectionConfig<"matches"> = {
	slug: "matches",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: anyone,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["title", "tournament"],
		useAsTitle: "title",
		group: "Chess",
	},
	hooks: {
		afterChange: [calculateScore],
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			admin: { hidden: true },
			hooks: {
				beforeChange: [createTitle],
				afterRead: [createTitle],
			},
		},
		{
			type: "row",
			fields: [
				{
					name: "playerOne",
					type: "relationship",
					relationTo: "players",
					hasMany: false,
					required: false,
					admin: {
						allowCreate: false,
					},
					access: {
						create: () => true,
						update: () => false,
					},
					validate: isPlayerInTournament,
					filterOptions: ({ data }) => {
						if (data.playerTwo) return { id: { not_equals: data.playerTwo } };
						return true;
					},
				},
				{
					name: "playerTwo",
					type: "relationship",
					relationTo: "players",
					hasMany: false,
					required: false,
					admin: {
						allowCreate: false,
					},
					access: {
						create: () => true,
						update: () => false,
					},
					validate: isPlayerInTournament,
					filterOptions: ({ data }) => {
						if (data.playerOne) return { id: { not_equals: data.playerOne } };
						return true;
					},
				},
			],
		},
		{
			label: "Winner",
			name: "result",
			type: "select",
			hasMany: false,
			options: [
				{ label: "Player One", value: "playerOneWin" },
				{ label: "Player Two", value: "playerTwoWin" },
				{ label: "Draw", value: "draw" },
			],
		},
		{
			name: "tournament",
			type: "relationship",
			relationTo: "tournaments",
			hasMany: false,
			admin: {
				allowCreate: false,
				readOnly: true,
			},
		},
	],
};
