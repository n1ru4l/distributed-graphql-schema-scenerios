import { makeExecutableSchema } from "@graphql-tools/schema";
import { stitchingDirectives } from "@graphql-tools/stitching-directives";
import { printSchemaWithDirectives } from "@graphql-tools/utils";

const { stitchingDirectivesTypeDefs, stitchingDirectivesValidator } =
  stitchingDirectives();

const users = [
  { id: "1", name: "Ada Lovelace" },
  { id: "2", name: "Alan Turing" },
];

const typeDefinitions = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
  }

  type Query {
    me: User
    user(id: ID!): User @merge(keyField: "id")
    _sdl: String!
  }
`;

let i = 0;

export const schema = stitchingDirectivesValidator(
  makeExecutableSchema({
    typeDefs: [stitchingDirectivesTypeDefs, typeDefinitions],
    resolvers: {
      Query: {
        me: () => users[0],
        user: (_root, { id }) => {
          console.log("legacy-users", i++);
          return (
            users.find((user) => user.id === id) ||
            new Error(`Could not find user with id '${id}'.`)
          );
        },
        _sdl: () => printSchemaWithDirectives(schema),
      },
    },
  })
);
