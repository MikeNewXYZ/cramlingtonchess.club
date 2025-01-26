import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { anyone } from "@/access/anyone";

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
		{
			name: "matches",
			type: "array",
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
						},
						{
							name: "playerTwo",
							type: "relationship",
							relationTo: "players",
							required: true,
							hasMany: false,
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
};
