import { TsFileToAst } from './parse/tsFileToAst';
import { Command } from 'commander';
import { AstToGraph } from './converter/astToGraph';
import { DependencyGraph } from './view/dependencyGraph';
import * as fs from 'fs';

// polyfill
import 'ts-polyfill/lib/es2019-array';

async function execute(rootPath: string, enableNodeModulesScan: boolean): Promise<void> {
    const asts = await new TsFileToAst().allFilesToAst(rootPath, enableNodeModulesScan);
    const model = new AstToGraph().toD3Model(asts);
    const svg = await new DependencyGraph(2400, 2400).toSvg(model);
    fs.writeFile('test.svg', svg.outerHTML, err => console.log(err));
    return;
}

const program = new Command();
program.version('0.0.1');
program
    .option('-d, --debug', 'output extra debugging')
    .option('-r, --root-path', 'root path (default ./)')
    .option('-e, --enable-node-modules-scan', 'by deafault node modules will be ignored');

program.parse(process.argv);
if (program.debug) {
    console.log(program.opts());
}
let rootPath = './';
if (program.rootPath) {
    console.log(`- ${program.rootPath}`);
    rootPath = program.rootPath;
}
let enableNodeModulesScan = false;
if (program.enableNodeModulesScan) {
    console.log(`- ${program.enableNodeModulesScan}`);
    enableNodeModulesScan = true;
}

execute(rootPath, enableNodeModulesScan);
