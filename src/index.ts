import { TsFileToAst } from './parse/tsFileToAst';
import { Command } from 'commander';
import { AstToGraph } from './converter/astToGraph';
import { DependencyGraph } from './view/dependencyGraph';
import * as fs from 'fs';

// polyfill
import 'ts-polyfill/lib/es2019-array';

async function execute(): Promise<void> {
    const asts = await new TsFileToAst().allFilesToAst();
    console.log(asts[0]);
    const model = new AstToGraph().toD3Model(asts);
    const svg = await new DependencyGraph(600, 600).toSvg(model);
    fs.writeFile('test.svg', svg.outerHTML, err => console.log(err));
    return;
}

const program = new Command();
program.version('0.0.1');

program
    .option('-d, --debug', 'output extra debugging')
    .option('-s, --small', 'small pizza size')
    .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);
if (program.debug) console.log(program.opts());
console.log('pizza details:');
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);

execute();
