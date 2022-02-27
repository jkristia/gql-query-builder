// https://www.graphql-tools.com/docs/schema-loading
// https://graphql.wtf/episodes/22-graphql-schema-file-loading-with-graphql-tools

import { GraphQLField, GraphQLNamedType, GraphQLNonNull, GraphQLNullableType, GraphQLObjectType, GraphQLScalarType, printSchema } from 'graphql';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { QueryBuilderGeenrator } from './generator';
import { QbDog, QbHuman } from './autogen/qb/qbtypes';


function loadTest() {
	const typeDefs = loadSchemaSync("src/schema.graphql", {
		loaders: [new GraphQLFileLoader()],
	});
	const types: { [key: string]: GraphQLNamedType } = typeDefs.getTypeMap();
	const qb = new QueryBuilderGeenrator();
	qb.generateQbClasses(types);
}


loadTest();

const qb1 = new QbHuman()
	.field(d => d.id)
	.field(d => d.name)
	.field(d => d.age)	
	.pets(new QbDog()
		.field(d => d.id)
		.field(d => d.breed)
	)

console.log(qb1.toString())