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
        const fileNameWithExtension = ast.filePath.split('/').pop();
        if (fileNameWithExtension) {
            const fileName = fileNameWithExtension.split('.')[0];
            this.addNode(fileName, 0, model);

            if (ast.imports && ast.imports.length > 0) {
                ast.imports
                    .map(value => value.libraryName.split('/').pop())
                    .filter<string>((libName): libName is string => libName != undefined && libName != null)
                    // .flatMap(value => (value as any).specifiers)
                    // .map(value => value.specifier)
                    .forEach(importName => {
                        this.addNode(importName, 1, model);
                        this.addLink(fileName, importName, 1, model);
                    });

                // const links: D3GraphLink[] = ast.imports
                //     .map(imp => (imp as any).specifiers
                //         .map(value => value.specifier)
                //         .map(importName => ({ srcId: importName, trgId: , value: 1 })));

                console.log(model);
            }
        }
    }

    private addNode(nodeName: string, group: number, model: D3GraphModel): void {
        const existingNode = model.nodes.find(n => n.id === nodeName);
        if (existingNode) {
            if (group < existingNode.group) {
                existingNode.group = group;
            }
        } else {
            model.nodes.push({ id: nodeName, group: group });
        }
    }

    private addLink(source: string, target: string, value: number, model: D3GraphModel): void {
        const existingLink = model.links.find(l => l.source === source && l.target === target);
        if (!existingLink) {
            model.links.push({
                source: source,
                target: target,
                value: value
            });
        }
    }
}
