import { File, TypescriptParser } from 'typescript-parser';

export class TsFileToAst {
    public async allFilesToAst(): Promise<File[]> {
        const parser = new TypescriptParser();
        return await parser.parseFiles(['./test-resources/simple/bar.ts', './test-resources/simple/foo.ts'], './');
    }

    public async fileToAst(): Promise<File> {
        const parser = new TypescriptParser();
        return await parser.parseFile('./test-resources/simple/bar.ts', './');
    }
}