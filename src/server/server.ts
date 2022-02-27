// https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express
// https://www.apollographql.com/docs/apollo-server/testing/build-run-queries/#graphql-playground
// import { makeExecutableSchema } 'graphql-tools';
import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import express, { Request, Response } from 'express'
import http from 'http';
import { loadSchemas } from '../shared/load-schema';

// const typeDefs = gql`
//   type Query {
//     hello: String
// 	abc: String
//   }
// `
// const resolvers = {
// 	Query: {
// 		hello() {
// 			return 'world'
// 		},
// 	},
// }

interface Adult {
	id: string;
	name: string;
	work: string;
}
interface Child {
	id: string;
	name: string;
	school: string;
}
const adults: Adult[] = [
	{ id: '1', name: 'adult1', work: 'a-work' },
	{ id: '2', name: 'adult2', work: 'a-work' },
]
const child: Child[] = [
	{ id: '3', name: 'child1', school: 'shool1' },
	{ id: '4', name: 'child2', school: 'shool2' },
]

interface Item {
	id: string;
	name: string;
}
interface Item1 extends Item {
	items?: Item2[]
}
interface Item2 extends Item {
	items?: Item2[]
}

const items1: Item1[] = [
	{ id: 'item1.1', name: 'abc' },
	{ id: 'item1.2', name: 'abc2' },
	{ id: 'item1.3', name: 'abc3' },
]

const items2: Item1[] = [
	{ id: 'item2.1', name: 'def' }
]

	// https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/
	// https://stackoverflow.com/questions/60251576/graphqlserver-union-types-abstract-type-n-must-resolve-to-an-object-type-at-run
	// https://www.apollographql.com/docs/apollo-server/data/resolvers/


const resolverMap = {
	// https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/
	// https://stackoverflow.com/questions/60251576/graphqlserver-union-types-abstract-type-n-must-resolve-to-an-object-type-at-run
	ItemInterface: {
		__resolveType: (obj: Item, context: any, info: any) => {
			// console.log('#2 :', obj, context, info);
			// does this only matter when __typename is being queried ?
			if (obj.id.startsWith('item1')) {
				return 'Item1';
			}
			return 'Item2';
		}
	},



	Query: {
		greeting() {
			return { hello: 'world' }
		},
		itemsAsInterface(parent: any, args: any, context: any, info: any) {
			// console.log('#1 :', parent, args, context, info)
			return [...items1, ...items2]
		}
	}
}


const PORT = 3000;
const app = express()
const httpServer = http.createServer(app)
app.get('/', (req: Request, res: Response) => {
	res.send('yep - works')
})

async function setupGraphQl() {
	const loadedTypeDefs = loadSchemas();

	// https://www.apollographql.com/docs/apollo-server/api/apollo-server/#schema
	const server = new ApolloServer({
		typeDefs: loadedTypeDefs,
		resolvers: resolverMap,
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			ApolloServerPluginLandingPageGraphQLPlayground({}),
		],
	})
	await server.start()
	server.applyMiddleware({ app })
}

async function start() {

	await setupGraphQl();
	httpServer.listen(PORT, () => {
		console.log(`listening on ${PORT}`)
	})

}

start();
