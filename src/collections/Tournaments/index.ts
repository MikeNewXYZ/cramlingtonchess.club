import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { anyone } from "@/access/anyone";
import { populateScores } from "./hooks/populateScores";
import { populateMatches } from "./hooks/populateMatches";

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
	hooks: {
		afterChange: [populateMatches, populateScores],
	},
	fields: [
		{
			name: "name",
			type: "text",
			minLength: 1,
			maxLength: 100,
			required: true,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "players",
			type: "relationship",
			relationTo: "players",
			required: true,
			hasMany: true,
			admin: {
				position: "sidebar",
			},
			access: {
				create: () => true,
				update: () => false,
			},
		},
		{
			name: "matches",
			type: "join",
			collection: "matches",
			on: "tournament",
			maxDepth: 0,
			admin: {
				defaultColumns: ["title", "result"],
				allowCreate: true,
			},
		},
		{
			name: "leaderboard",
			type: "join",
			collection: "scores",
			on: "tournament",
			maxDepth: 0,
			defaultSort: "-totalPoints",

			admin: {
				defaultColumns: ["player", "totalPoints"],
				allowCreate: false,
			},
		},
	],
};
