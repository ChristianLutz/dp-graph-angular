import {
    create,
    forceCenter,
    forceLink,
    forceManyBody,
    forceSimulation,
    SimulationNodeDatum,
    SimulationLinkDatum,
    scaleOrdinal,
    schemeCategory10
} from 'd3';
import { JSDOM } from 'jsdom';

export interface D3GraphModel {
    links: D3GraphLink[];
    nodes: D3GraphNode[];
}

export interface D3GraphLink extends SimulationLinkDatum<D3GraphNode> {
    srcId: string;
    trgId: string;
    value: number;
}

export interface D3GraphNode extends SimulationNodeDatum {
    id: string;
    group: number;
}

/**
 * Based on https://observablehq.com/@d3/force-directed-graph
 */
export class DependencyGraph {
    constructor(private width: number, private height: number) {}

    public async toSvg(data: D3GraphModel): Promise<SVGSVGElement> {
        const links = data.links.map(d => Object.create(d));
        const nodes = data.nodes.map(d => Object.create(d));

        const simulation = forceSimulation(nodes)
            .force('link', forceLink<D3GraphNode, D3GraphLink>(links).id(node => node.id))
            .force('charge', forceManyBody())
            .force('center', forceCenter(this.width / 2, this.height / 2));

        (global as any).document = new JSDOM('<!doctype html><html><body></body></html>').window.document;
        const svg = create('svg')
            .attr('viewBox', `[0, 0, ${this.width}, ${this.height}]`)
            .attr('version', '1.1')
            .attr('xmlns', 'http://www.w3.org/2000/svg');

        const link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data<D3GraphLink>(links)
            .join('line')
            .attr('stroke-width', d => Math.sqrt(d.value));

        const node = svg
            .append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data<D3GraphNode>(nodes)
            .join('circle')
            .attr('r', 5)
            .attr('fill', this.color());

        node.append('title').text(d => d.id);

        simulation.on('tick', () => {
            link.attr('x1', d => (d.source as SimulationNodeDatum).x || 0)
                .attr('y1', d => (d.source as SimulationNodeDatum).y || 0)
                .attr('x2', d => (d.target as SimulationNodeDatum).x || 0)
                .attr('y2', d => (d.target as SimulationNodeDatum).y || 0);

            node.attr('cx', d => d.x || 0).attr('cy', d => d.y || 0);
        });
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        await delay(5000);
        simulation.stop();

        const svgNode = svg.node();
        if (svgNode) {
            return svgNode;
        }
        return new SVGSVGElement();
    }

    private color(): (d: D3GraphNode) => string {
        const scale = scaleOrdinal(schemeCategory10);
        return d => scale('' + d.group);
    }
}
