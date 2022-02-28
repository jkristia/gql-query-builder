import { QbHello, QbItemA, QbItemInterface, QbQuery, QbUnionItem } from './autogen/qb/qbtypes';
import { Command } from 'commander';
import { exit } from 'process';
import { QueryBuilderGeenrator } from './generator';

function runDev() {
	const inputFile = 'src/schemas/schema.graphql'
	const outputPath = 'src/autogen/qb'
	const qb = new QueryBuilderGeenrator(inputFile);
	qb.generateQbClasses(outputPath);

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

}


function runMain() {
	const program = new Command()
	program
		.name('graphql-guerybuilder-generator')
		.description('Generates TypeScript query classes based on .graphql schema')
	program
		.option('-i, --input  [file]', '.graphql root file')
		.option('-o, --output [path]', 'output path')

	interface Options {
		input: string;
		output: string;
	}
	program.parse(process.argv);
	const options = program.opts() as Options;
	if (!options.input || !options.output) {
		console.log('\n** Both --input and --output must be passed **\n')
		program.help()
		exit();
	}

	console.log(options)
	const qb = new QueryBuilderGeenrator(options.input);
	qb.generateQbClasses(options.output);
}

// runDev();
runMain();
