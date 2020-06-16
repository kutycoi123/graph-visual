import React, {useState, useRef, useEffect} from 'react';
import {Mode} from '../constants.js';
import './GraphBoard.css';
function GraphBoard(props) {
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);

	const {
		mode
	} = props;

	const graph = useRef();
	const isOverlapped = (x, y) => {
		for (let node of nodes) {
			if (Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y,2)) <= Mode.NODE_RADIUS) {
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
		const nodeIdx = nodes.findIndex((node) => node.id === id)
		if (nodeIdx > -1) {
			const newNodes = [...nodes];
			newNodes.splice(nodeIdx, 1);
			const newEdges = edges.filter((edge) => edge.start !== id || edge.end !== id);
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
	const handleClick = (event) => {
		console.log("Svg clicked");
		if (mode == Mode.DRAWNODE) {
			console.log("DRAWNODE")
			handleDrawNode(event.offsetX, event.offsetY);
		}
	}
	const handleStartDrag = (event) => {
		console.log(event)
		console.log("Start drag");
	} 
	const handleDragging = (event) => {
		console.log("Dragging");
	}
	const handleEndDrag = (event) => {
		console.log("End drag");
	}

	if (mode != undefined) {
		if (mode == Mode.MOVE || mode == Mode.DRAWEDGE) {
			graph.current.onclick = undefined;
			graph.current.onmousedown = handleStartDrag;
			graph.current.onmousemove = handleDragging;
			graph.current.onmouseup = handleEndDrag;
		} else{
			if ([Mode.DRAWNODE, Mode.REMOVEEDGE, Mode.REMOVENODE].includes(mode)) {
				graph.current.onclick = handleClick;
			} else if (mode == Mode.RESET) {
				graph.current.onclick = undefined;
			}
			graph.current.onmousedown = undefined;
			graph.current.onmousemove = undefined;
			graph.current.onmouseup = undefined;
		}
	}
	useEffect(() => {
		if (mode == Mode.RESET) {
			setEdges([]);
			setNodes([]);
		}

	}, [mode])
	return (
		<svg ref={graph} className="graph">
			{nodes.map((e, idx) => {

				return (
					<g className="nodegroup">

					<circle
		        	//onMouseDown={() => console.log("Node mouse down")}
			        className="draggable"
			        cx={e.x}
			        cy={e.y}
			        r={Mode.NODE_RADIUS}
			        id={e.id}
			      	></circle>
			      	<text x={e.x-4} y={e.y + 4}>{e.id}</text>
					</g>

			    )
			})}

		</svg>			
	);
}

export default GraphBoard;