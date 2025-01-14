import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { anyone } from "@/access/anyone";
import { createTitle } from "./hooks/createTitle";

export const Players: CollectionConfig<"players"> = {
	slug: "players",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: anyone,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["title"],
		useAsTitle: "title",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			defaultValue: "",
			admin: { hidden: true },
			hooks: {
				beforeChange: [createTitle],
				afterRead: [createTitle],
			},
		},
		{
			name: "name",
			type: "text",
			minLength: 1,
			maxLength: 100,
			required: true,
		},
		{
			name: "tournaments",
			type: "join",
			collection: "tournaments",
			on: "players",
			maxDepth: 0,
			admin: {
				defaultColumns: ["name", "players"],
				allowCreate: false,
			},
		},
	],
};
