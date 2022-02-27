// https://www.graphql-tools.com/docs/schema-loading
// https://graphql.wtf/episodes/22-graphql-schema-file-loading-with-graphql-tools

import { GraphQLNamedType } from 'graphql';
import { QbHello, QbItemA, QbItemInterface, QbQuery, QbUnionItem } from './autogen/qb/qbtypes';
import { QueryBuilderGeenrator } from './generator';
import { loadSchemas } from './shared/load-schema';


function loadTest() {
	const schema = loadSchemas();
	const types: { [key: string]: GraphQLNamedType } = schema.getTypeMap();
	const qb = new QueryBuilderGeenrator();
	qb.generateQbClasses(types);
}


loadTest();

const qb1 = new QbQuery()
	.greeting(new QbHello().field(d => d.hello))
	.itemsAsInterface(
		new QbItemInterface()
			.field(d => d.id)
			.field(d => d.name)
			.fragment(new QbItemA()
				.field(d => d.onlyOnA)
				.field(d => d.id)
			)
	)
	.itemsAsUnion(new QbUnionItem()
		.fragment(new QbItemA()
			.field(d => d.onlyOnA)
			.field(d => d.id)
		)
	)
console.log(qb1.toString())
