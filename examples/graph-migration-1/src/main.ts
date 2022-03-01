import { stitchingDirectives } from "@graphql-tools/stitching-directives";
import { stitchSchemas } from "@graphql-tools/stitch";
import { createServer } from "@graphql-yoga/node";

import { schema as legacyUsersSchema } from "./sub-graphs/legacy-users";
import { schema as usersSchema } from "./sub-graphs/users";

const { stitchingDirectivesTransformer } = stitchingDirectives();

async function main() {
  const schema = stitchSchemas({
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
    subschemas: [
      {
        schema: usersSchema,
      },
      {
        schema: legacyUsersSchema,
      },
    ],
  });

  createServer({
    schema,
    port: 8080,
    logging: false,
  }).start();
}

main();
