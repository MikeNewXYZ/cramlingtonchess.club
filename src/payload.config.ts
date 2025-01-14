import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Players } from "./collections/Players";
import { Matches } from "./collections/Matches";
import { Tournaments } from "./collections/Tournaments";
import { Scores } from "./collections/Scores";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [Users, Media, Players, Matches, Tournaments, Scores],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: sqliteAdapter({
		client: {
			url: process.env.PAYLOAD_DATABASE_URI || "",
		},
	}),
	sharp,
	email: nodemailerAdapter({
		defaultFromAddress: process.env.PAYLOAD_EMAIL_FROM_ADDRESS || "",
		defaultFromName: process.env.PAYLOAD_EMAIL_FROM_NAME || "",
		transportOptions: {
			host: process.env.PAYLOAD_EMAIL_SMTP_HOST,
			port: process.env.PAYLOAD_EMAIL_SMTP_PORT,
			auth: {
				user: process.env.PAYLOAD_EMAIL_SMTP_USER,
				pass: process.env.PAYLOAD_EMAIL_SMTP_PASSWORD,
			},
		},
	}),
	plugins: [],
});
