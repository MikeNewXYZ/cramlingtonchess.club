import type { FieldHook } from "payload";

export const createTitle: FieldHook = ({ data }) => `${data?.name}#${data?.id}`;
