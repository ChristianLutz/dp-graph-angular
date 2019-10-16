import { File, TypescriptParser } from 'typescript-parser';
import * as fs from 'fs';
import * as path from 'path';

export class TsFileToAst {
    public async allFilesToAst(rootPath: string): Promise<File[]> {
        return await Promise.all(this.findAllTsFiles(rootPath).map(fileName => this.parseFile(fileName)));
    }

    public async fileToAst(file: string): Promise<File> {
        const parser = new TypescriptParser();
        return await parser.parseFile(file, './');
    }

    private async parseFile(fileName: string, rootPath = './'): Promise<File> {
        const parser = new TypescriptParser();
        return await parser.parseFile(fileName, rootPath);
    }

    private findAllTsFiles(rootPath: string): string[] {
        const result = [];

        const files = [rootPath];
        do {
            const filepath = files.pop();
            if (filepath) {
                const fileStatus = fs.lstatSync(filepath);
                if (fileStatus.isDirectory()) {
                    fs.readdirSync(filepath).forEach(f => files.push(path.join(filepath, f)));
                } else if (fileStatus.isFile() && filepath.indexOf('.ts') > 0) {
                    result.push(rootPath + '/' + path.relative(rootPath, filepath));
                }
            }
        } while (files.length !== 0);

        return result;
    }
}
