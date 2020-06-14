import React, {useState, useEffect} from 'react';
import GraphBoard from './GraphBoard.js';

const RUN = 1
const DRAW = 2
const MOVE = 3
const REMOVENODE = 4
const REMOVEEDGE = 5
const RESET = 6
const NODE_RADIUS = 50
/*
Node: {
	id,x,y,color,neighbors
}
Edge: {
	id, start(id of start node), end(id of end node)
}

*/
function Main() {
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [mode, setMode] = useState();
	const handleChangeMode = (mode) => {
		switch (mode) {
			case RESET: 
				setNodes([]);
				setEdges([]);
				break;
			case RUN:
				break;
		}
		setMode(mode);
	}
	const isOverlapped = (x, y) => {
		for (let node of nodes) {
			if (Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y,2)) <= NODE_RADIUS) {
				return true;
			}
		}
		return false;
	}
	const handleDrawNode = (x, y) => {
		// Add new node with position (x,y)
		// Make sure (x,y) does not overlap with any node
		if (!isOverlapped(x, y)) {
			// Add new node
			const newNode = {id: nodes.length, x, y, color: 0, neighbors: []}
			setNodes([...nodes, newNode])
		}

	}
	const handleRemoveNode = (id) => {
		// Remove node with given id
		const nodeIdx = nodes.findIndex((node) => node.id == id)
		if (nodeIdx > -1) {
			const newNodes = [...nodes];
			newNodes.splice(nodeIdx, 1);
			const newEdges = edges.filter((edge) => edge.start != id || edge.end != id);
			setNodes(newNodes);
			setEdges(newEdges);
		}


	}
	const handleRemoveEdge = (id) => {
		// Remove edge with given edge id
		const edgeIdx = edges.findIndex((edge) => edge.id == id)
		if (edgeIdx > -1) {
			const newEdges = [...edges]
			newEdges.splice(edgeIdx, 1);
			setEdges(newEdges);
		}
	}
	return (

		<div>
			<div className="graph-mode">
				<button onClick={() => handleChangeMode(1)}>Run algorithm</button>
				<button onClick={() => handleChangeMode(2)}>Draw node</button>
				<button onClick={() => handleChangeMode(3)}>Move node</button>
				<button onClick={() => handleChangeMode(4)}>Remove node</button>
				<button onClick={() => handleChangeMode(5)}>Remove edge</button>
				<button onClick={() => handleChangeMode(6)}>Reset</button>
			</div>
			<div className="graph-board">
				<GraphBoard 
					nodes={nodes} 
					edges={edges} 
				/>
			</div>
		</div>
	);
}


export default Main;