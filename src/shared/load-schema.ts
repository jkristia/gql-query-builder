import { GraphQLSchema } from 'graphql';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

export function loadSchemas(): GraphQLSchema {
	const schemas = loadSchemaSync("src/schemas/schema.graphql", {
		loaders: [new GraphQLFileLoader()],
	});
	return schemas;
}
