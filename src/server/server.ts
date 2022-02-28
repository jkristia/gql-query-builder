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

interface Item {
	id: string;
	name: string;
}
interface ItemA extends Item {
	items?: ItemB[]
	onlyOnA: string;
}
interface ItemB extends Item {
	items?: ItemA[]
	onlyOnB: string;
}

const itemsA: ItemA[] = [
	{ id: 'item1.1', name: 'abc', onlyOnA: 'a' },
	{ id: 'item1.2', name: 'abc2', onlyOnA: 'a' },
	{ id: 'item1.3', name: 'abc3', onlyOnA: 'a' },
]

const itemsB: ItemB[] = [
	{ id: 'item2.1', name: 'def', onlyOnB: 'b' }
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
				return 'ItemA';
			}
			return 'ItemB';
		}
	},
	UnionItem: {
		__resolveType: (obj: Item, context: any, info: any) => {
			console.log('#2 :', obj, context, info);
			// does this only matter when __typename is being queried ?
			if (obj.id.startsWith('item1')) {
				return 'ItemA';
			}
			return 'ItemB';
		}
	},

	Query: {
		greeting() {
			return { hello: 'world' }
		},
		itemsAsUnion(parent: any, args: any, context: any, info: any) {
			// console.log('#1 :', parent, args, context, info)
			return [...itemsA, ...itemsB]
		},
		itemsAsInterface(parent: any, args: any, context: any, info: any) {
			// console.log('#1 :', parent, args, context, info)
			return [...itemsA, ...itemsB]
		}
	}
}

/*
	adding resolve type for fragment support query

	query{
		itemsAsInterface {
			id
			name
			... on ItemA {
			onlyOnA
			}
			... on ItemB {
			onlyOnB
			}
		}
	}
*/


const PORT = 3000;
const app = express()
const httpServer = http.createServer(app)
app.get('/', (req: Request, res: Response) => {
	res.send('yep - works')
})

async function setupGraphQl() {
	const inputFile = 'src/schemas/schema.graphql'
	const loadedTypeDefs = loadSchemas(inputFile);

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
