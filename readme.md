# GraphQL TypeScript query builder

!! Work in progress !!

Generator for creating typed graphql queries.

The purpose of this generate is to create classes for creating typed GraphQl queries.  
The generator creates a typescript class for each `type`, `interface` and `union` in the graphql schema.


```graphql
interface ItemInterface {
	id: ID!
	name: String!
}
union UnionItem = ItemA | ItemB

type ItemA implements ItemInterface {
	id: ID!
	name: String!
	items: [ItemB!]
	onlyOnA: String
}

type ItemB implements ItemInterface {
	id: ID!
	name: String!
	items: [ItemA!]
	onlyOnB: String
}

type Hello {
	hello: String
}

type Query {
	greeting: Hello!
	itemsAsUnion: [UnionItem!]
	itemsAsInterface: [ItemInterface!]
}


```

The generated classes allows for building a typed query using a fluent interface.  
`Note. There is no type restriction on the fragment query object`  
Example of a query:

```typescript
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
```

Output of the query:
```
{
   greeting{
      hello
   }
   itemsAsInterface{
      id
      name
      ... on QbItemA {
         onlyOnA
         id
      }
   }
   itemsAsUnion{
      ... on QbItemA {
         onlyOnA
         id
      }
   }
}

```
[Auto generated file](src/autogen/qb/qbtypes.ts)

// https://www.graphql-tools.com/docs/schema-loading
// https://graphql.wtf/episodes/22-graphql-schema-file-loading-with-graphql-tools


