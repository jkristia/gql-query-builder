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
	name: string;
	work: string;
}
interface Child {
	name: string;
	school: string;
}
const adults: Adult[] = [
	{ name: 'adult1', work: 'a-work'},
	{ name: 'adult2', work: 'a-work'},
]
const child: Child[] = [
	{ name: 'child1', school: 'shool1'},
	{ name: 'child2', school: 'shool2'},
]

const resolverMap = {
	// https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/
	// https://stackoverflow.com/questions/60251576/graphqlserver-union-types-abstract-type-n-must-resolve-to-an-object-type-at-run
	Person: {
		__resolverType: (obj: any, context: any, info: any) => {
			console.log(obj, context, info);
			return 'Adult';
		}
	},

	Query: {
		hello() {
			return 'world'
		},
		greeting() {
			return { hello: 'world' }
		},
		// https://www.apollographql.com/docs/apollo-server/data/resolvers/
		persons() {
			return adults;
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
