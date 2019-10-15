import { D3GraphModel } from '../view/dependencyGraph';
import { File } from 'typescript-parser';

export class AstToGraph {
    constructor() {}

    public toD3Model(asts: File[]): D3GraphModel {
        const model: D3GraphModel = {
            nodes: [],
            links: []
        };

        asts.forEach(ast => this.extendModelByFileAst(ast, model));
        return model;
    }

    private extendModelByFileAst(ast: File, model: D3GraphModel): void {
        if (ast.imports && ast.imports.length > 0) {
            model.nodes.push({ id: ast.filePath, group: 0 });

            ast.imports
                .map(value => value.libraryName.split('/').pop())
                .filter<string>((libName): libName is string => libName != undefined && libName != null)
                // .flatMap(value => (value as any).specifiers)
                // .map(value => value.specifier)
                .forEach(importName => {
                    model.nodes.push({ id: importName, group: 1 });
                    model.links.push({
                        srcId: ast.filePath,
                        source: ast.filePath,
                        trgId: importName,
                        target: importName,
                        value: 1
                    });
                });

            // const links: D3GraphLink[] = ast.imports
            //     .map(imp => (imp as any).specifiers
            //         .map(value => value.specifier)
            //         .map(importName => ({ srcId: importName, trgId: , value: 1 })));
            console.log(ast.imports);
            console.log((ast.imports[0] as any).specifiers);
            console.log(model);
        }
    }
}
