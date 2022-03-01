import { makeExecutableSchema } from "@graphql-tools/schema";
import { stitchingDirectives } from "@graphql-tools/stitching-directives";
import { printSchemaWithDirectives } from "@graphql-tools/utils";

const { stitchingDirectivesTypeDefs, stitchingDirectivesValidator } =
  stitchingDirectives();

const users = [
  { id: "1", name: "Ada Lovelace", username: "@ada" },
  { id: "2", name: "Alan Turing", username: "@complete" },
];

const typeDefinitions = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    username: String!
  }

  type Query {
    me: User
    user(id: ID!): User @merge(keyField: "id")
    _sdl: String!
  }
`;

export const schema = stitchingDirectivesValidator(
  makeExecutableSchema({
    typeDefs: [stitchingDirectivesTypeDefs, typeDefinitions],
    resolvers: {
      Query: {
        me: () => users[0],
        user: (_root, { id }) => {
          console.log("users");
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
