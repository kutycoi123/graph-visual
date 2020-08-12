
export const Mode = {
	RUN: 1,
	DRAWNODE: 2,
	MOVE: 3,
	REMOVENODE: 4,
	REMOVEEDGE: 5,
	DRAWEDGE: 6,
	RESET: 7,
	FINISH: 8,
	RESETCOLOR: 9,
	NODE_RADIUS: 20

};
export const COLOR_MAPPING = {
	0: '#eb4034',
	1: '#f7a92a',
	2: '#f7e62a',
	3: '#b6f72a',
	4: '#2af7f0',
	5: '#2a7ff7',
	6: '#5a2af7',
	7: '#d12af7',
	8: '#f72acb',
	9: '#f72a67',
	10: '#f72a2a',

}
function isOverlapped(x, y, nodes){
	for (let node of nodes) {
		if (Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y,2)) <= Mode.NODE_RADIUS) {
			return true;
		}
	}
	return false;
}
function get_edges(nodes) {
	let edges = [];
	for (let node of nodes) {
		let neighbors_edges = node.neighbors.map(id => {
			return {from: node.id, to: id};
		})
		edges = edges.concat(neighbors_edges);
	}
	return edges;
}
function create_node(id, nodes) {
	let x, y;
	do {
		x = Math.floor(Math.random() * 1000 + 30);
		y = Math.floor(Math.random() * 700 + 20);
		console.log(x, y);
	}while(isOverlapped(x, y, nodes));
	return {x, y, id, neighbors: []};
}

export function CREATE_UNDIRECTIONAL_GRAPH(nNodes) {
	let nodes = [];
	for (let i = 0; i < nNodes; ++i) {
		nodes.push(create_node(i, nodes));
	}
	for (let i = 0; i < nNodes; ++i)  {
		let node = nodes[i];
		let nNeighbors = Math.floor(Math.random() * parseInt(nNodes / 2));		
		for (let j = i+1; j < nNodes && node.neighbors.length < nNeighbors; ++j){
			let is_neighbor = Math.round(Math.random() * 1);
			if (is_neighbor) {
				node.neighbors.push(nodes[j].id);
				nodes[j].neighbors.push(node.id);
			}
		}
	}
	let edges = get_edges(nodes);
	return {nodes, edges};
}
