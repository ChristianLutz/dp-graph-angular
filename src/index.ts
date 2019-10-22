import { TsFileToAst } from './parse/tsFileToAst';
import { Command } from 'commander';
import { AstToGraph } from './converter/astToGraph';
import { DependencyGraph } from './view/dependencyGraph';
import * as fs from 'fs';

// polyfill
import 'ts-polyfill/lib/es2019-array';

async function execute(rootPath: string): Promise<void> {
    const asts = await new TsFileToAst().allFilesToAst(rootPath);
    const model = new AstToGraph().toD3Model(asts);
    const svg = await new DependencyGraph(2400, 2400).toSvg(model);
    fs.writeFile('test.svg', svg.outerHTML, err => console.log(err));
    return;
}

const program = new Command();
program.version('0.0.1');
program.option('-d, --debug', 'output extra debugging').option('-r, --root-path', 'root path (default ./)');

program.parse(process.argv);
if (program.debug) {
    console.log(program.opts());
}
let rootPath = './';
if (program.rootPath) {
    console.log(`- ${program.rootPath}`);
    rootPath = program.rootPath;
}

execute(rootPath);
