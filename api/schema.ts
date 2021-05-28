import { join } from "path";
import { makeSchema } from "nexus";
import * as types from "./graphql";

export const schema = makeSchema({
  types,
  outputs: {
    schema: join(__dirname, "..", "schame.graphql"),
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
  },
  contextType: {
    export: "Context",
    module: join(__dirname, "./context.ts"),
  },
});
