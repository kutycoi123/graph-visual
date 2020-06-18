import React, {useState, useRef, useEffect} from 'react';
import {Mode} from '../constants.js';
import './GraphBoard.css';
function GraphBoard(props) {
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [nodeCnt, setNodeCnt] = useState(0);
	const {
		mode
	} = props;

	const graph = useRef();
	const clickedNode = useRef();
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
			const newNode = {id: nodeCnt, x, y, color: 0, neighbors: []}
			setNodes([...nodes, newNode])
			setNodeCnt(nodeCnt+1)
		}

	}

	const handleMoveNode = (id, x, y) => {
		const nodeIdx = nodes.findIndex((node) => node.id === id)
		if (nodeIdx > -1){
			const oldNode = nodes[nodeIdx];
			const newNodes = [...nodes.slice(0, nodeIdx), {...oldNode, x: x, y: y}, ...nodes.slice(nodeIdx+1)]
			console.log("Updating", x, y)
			setNodes(newNodes);
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
		const edgeIdx = edges.findIndex((edge) => edge.id === id)
		if (edgeIdx > -1) {
			const newEdges = [...edges]
			newEdges.splice(edgeIdx, 1);
			setEdges(newEdges);
		}
	}
	const handleClick = (event) => {
		if (mode === Mode.DRAWNODE) {
			handleDrawNode(event.offsetX, event.offsetY);
		} else if (mode === Mode.REMOVENODE) {
			let id = event.target.getAttribute('id')
			if (id == 0 || id) {
				handleRemoveNode(parseInt(id));
			}
		}
	}
	const handleStartDrag = (event) => {
		const elem = event.target;
		if (elem.classList.contains("draggable")) {
			clickedNode.current = elem;
		}
	} 
	const handleDragging = (event) => {
		if (event.target.classList.contains("draggable") && clickedNode.current) {
			let x = event.offsetX;
			let y = event.offsetY;
			clickedNode.current.setAttribute("cx", x);
			clickedNode.current.setAttribute("cy", y);
			clickedNode.current.nextElementSibling.setAttribute("x", x-4);
			clickedNode.current.nextElementSibling.setAttribute("y", y+4);
			console.log("Drag:", x, y)
			handleMoveNode(parseInt(clickedNode.current.getAttribute('id')), x, y);
		}
	}
	const handleEndDrag = (event) => {
		clickedNode.current = undefined;
	}

	if (mode !== undefined) {
		if (mode === Mode.MOVE || mode === Mode.DRAWEDGE) {
			graph.current.onclick = undefined;
			graph.current.onmousedown = handleStartDrag;
			graph.current.onmousemove = handleDragging;
			graph.current.onmouseup = handleEndDrag;
		} else{
			if ([Mode.DRAWNODE, Mode.REMOVEEDGE, Mode.REMOVENODE].includes(mode)) {
				graph.current.onclick = handleClick;
			} else if (mode === Mode.RESET) {
				graph.current.onclick = undefined;
			}
			graph.current.onmousedown = undefined;
			graph.current.onmousemove = undefined;
			graph.current.onmouseup = undefined;
		}
	}
	useEffect(() => {
		if (mode === Mode.RESET) {
			setEdges([]);
			setNodes([]);
			setNodeCnt(0);
		}

	}, [mode])
	console.log(nodes);
	return (
		<svg ref={graph} className="graph">
			{nodes.map((e, idx) => {

				return (
					<g className="nodegroup">

					<circle
		        	//onMouseDown={() => console.log("Node mouse down")}
			        className="draggable node"
			        cx={e.x}
			        cy={e.y}
			        r={Mode.NODE_RADIUS}
			        id={e.id}
			      	></circle>
			      	<text className="nodelabel" x={e.x-4} y={e.y + 4}>{e.id}</text>
					</g>

			    )
			})}

		</svg>			
	);
}

export default GraphBoard;