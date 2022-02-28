import { GraphQLSchema } from 'graphql';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

export function loadSchemas(filename: string): GraphQLSchema {
	const schemas = loadSchemaSync(filename, {
		loaders: [new GraphQLFileLoader()],
	});
	return schemas;
}
