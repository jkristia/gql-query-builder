// https://www.graphql-tools.com/docs/schema-loading
// https://graphql.wtf/episodes/22-graphql-schema-file-loading-with-graphql-tools

import { GraphQLNamedType } from 'graphql';
import { QueryBuilderGeenrator } from './generator';
import { QbDog, QbHuman } from './autogen/qb/qbtypes';
import { loadSchemas } from './shared/load-schema';


function loadTest() {
	const schema = loadSchemas();
	const types: { [key: string]: GraphQLNamedType } = schema.getTypeMap();
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