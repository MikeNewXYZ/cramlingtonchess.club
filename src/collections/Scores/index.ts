import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { anyone } from "@/access/anyone";

export const Scores: CollectionConfig = {
	slug: "scores",
	access: {
		create: authenticated,
		delete: authenticated,
		read: anyone,
		update: authenticated,
	},
	admin: {
		group: "Chess",
	},
	fields: [
		{
			name: "player",
			type: "relationship",
			relationTo: "players",
			required: false,
		},
		{
			name: "tournament",
			type: "relationship",
			relationTo: "tournaments",
			required: false,
			admin: {
				readOnly: true,
			},
		},
		{
			name: "totalPoints",
			type: "number",
			required: true,
			defaultValue: 0,
			index: true,
		},
	],
};
