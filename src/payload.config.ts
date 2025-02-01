import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Players } from "./collections/Players";
import { Tournaments } from "./collections/Tournaments";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
			icons: [
				{
					rel: "icon",
					type: "image/x-icon",
					url: "brand/favicon.ico",
					sizes: "48x48",
					fetchPriority: "high",
				},
			],
		},
		components: {
			graphics: {
				Icon: {
					path: "@/payload-components/graphics/BrandIcon",
					exportName: "BrandIcon",
				},
				Logo: {
					path: "@/payload-components/graphics/BrandLogo",
					exportName: "BrandLogo",
				},
			},
		},
	},
	collections: [Players, Tournaments, Users, Media],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		pool: {
			connectionString: process.env.PAYLOAD_DATABASE_URI || "",
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
