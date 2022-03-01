# Graph Migration Scenario 1

We have two subgraphs:

1. users
2. legacy-users

Both contain a `User` type and a `Query.user` field.

This simulates a transition period where type is migrated over from one subgraph (legacy-users) to a another one (users).

The `User` type within the `users` subgraph has the additional field `username`, which does not exist within the `legacy-users` subgraph.

## Experiments

### Experiment 1

**Run**

```graphql
{
  user(id: "1") {
    id
    name
  }
}
```

**Console output:**

```bash
legacy-users 0
```

Legacy subgraph is used, because the executor is picked based on the order:

```typescript
stitchSchemas({
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
```

**Learning**:
Switching the `subschemas` array entries results in the `users` schema being used. The order in the `subschemas` array is responsible for choosing which schema should be used.

## Experiment 2

**Run**

```graphql
{
  user(id: "1") {
    id
    name
    username
  }
}
```

**Console output:**

```bash
legacy-users 0
users
```

First the `legacy-users` and then the `users` users schema is called. `id` and `name` are resolved from `legacy-users`. `username` is received from `users`, as the field only exists in that service.

**Learning**:
The gateway executor is not that smart. An ideal scenario it would first have analyzed the selection set and recognized that it can retrieve all the data by doing a single roundtrip to the `users` schema instead of first calling the `legacy-users` schema, followed by calling the `users` schema.
