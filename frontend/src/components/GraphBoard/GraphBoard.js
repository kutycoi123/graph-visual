import React, {useState, useRef, useEffect} from 'react';
import {Mode} from '../constants.js';
import './GraphBoard.css';


function GraphBoard(props) {
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [nodeCnt, setNodeCnt] = useState(0);
	const [pairNode, setPairNode] = useState({
		from: undefined,
		to: undefined
	});

	const {
		mode, algo
	} = props;
	const graph = useRef();
	const clickedNode = useRef();
	const calculateAccurateCoords = (x1, y1, x2, y2) => {
	  let dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	  let ratio = (dist - Mode.NODE_RADIUS) / dist; 
	  let dx = (x2 - x1) * ratio;
	  let dy = (y2 - y1) * ratio;
	  let intersectX = x1 + dx;
	  let intersectY = y1 + dy;
	  return { x: intersectX, y: intersectY };
	};
	const replaceNode = (id, newNode, nodes) => {
		const idx = nodes.findIndex(e => e.id === id);
		if (idx > -1) {
			const newNodes = [...nodes];
			newNodes[idx] = {...nodes[idx], ...newNode};
			return newNodes;
		}
		return nodes;
	}
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
		let newNode = {id, x, y};
		const newNodes = replaceNode(id, newNode, nodes);
		setNodes(newNodes);
	}

	const handleRemoveNode = (id) => {
		// Remove node with given id
		const nodeIdx = nodes.findIndex((node) => node.id === id)
		if (nodeIdx > -1) {
			let newNodes = [...nodes];
			newNodes.splice(nodeIdx, 1);
			newNodes = newNodes.map(e => {
				e.neighbors = e.neighbors.filter(neighborId => neighborId !== id);
				return e;
			})
			const newEdges = edges.filter((edge) => edge.from !== id && edge.to !== id);
			setEdges(newEdges);
			setNodes(newNodes);
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
		} else if (mode === Mode.REMOVENODE && event.target.classList.contains("node")) {
			const id = parseInt(event.target.getAttribute('id'));
			if (id == 0 || id) {
				handleRemoveNode(id);
			}
		} else if (mode == Mode.DRAWEDGE && event.target.classList.contains("node")) {
			const id = parseInt(event.target.getAttribute('id'));
			if (id == 0 || id) {
				if (pairNode.from == undefined) {
					const newNodes = replaceNode(id, {color: "red"}, nodes)
					setPairNode({...pairNode, from: id});
					setNodes(newNodes);
				} else if (pairNode.to == undefined) {
					const newNodes = replaceNode(id, {color: "green"}, nodes)
					setPairNode({...pairNode, to: id});
					setNodes(newNodes);
					setTimeout(() => {
						const fromNode = nodes.find(e => e.id === pairNode.from);
						const toNode = nodes.find(e => e.id === id);
						fromNode.color = toNode.color = "white";
						fromNode.neighbors.push(toNode.id);
						toNode.neighbors.push(fromNode.id);
						const newEdges = [...edges, {from: fromNode.id, to: toNode.id}, 
										 {to: fromNode.id, from: toNode.id}]
						const newNodes = [...nodes];
						setPairNode({});
						setNodes(newNodes);
						setEdges(newEdges);
					}, 300)
				}
			}
		} else if (mode == Mode.REMOVEEDGE && event.target.classList.contains("edge")) {
			const id = event.target.getAttribute('id').split(" ");
			const fromId = parseInt(id[0])
			const toId = parseInt(id[1]);
			const newEdges = edges.filter(e => (e.from !== fromId || e.to !== toId) && (e.from !== toId || e.to !== fromId))
			const fromNode = nodes.find(e => e.id === fromId);
			const toNode = nodes.find(e => e.id === toId);
			fromNode.neighbors = fromNode.neighbors.filter(id => id !== toId);
			toNode.neighbors = toNode.neighbors.filter(id => id !== fromId);
			const newNodes = [...nodes];
			setEdges(newEdges);
			setNodes(newNodes);
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
			handleMoveNode(parseInt(clickedNode.current.getAttribute('id')), x, y);
		}
	}
	const handleEndDrag = (event) => {
		clickedNode.current = undefined;
	}

	if (mode !== undefined) {
		if (mode === Mode.MOVE) {
			graph.current.onclick = undefined;
			graph.current.onmousedown = handleStartDrag;
			graph.current.onmousemove = handleDragging;
			graph.current.onmouseup = handleEndDrag;
		} else{
			if ([Mode.DRAWNODE, Mode.DRAWEDGE, Mode.REMOVEEDGE, Mode.REMOVENODE].includes(mode)) {
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
	return (
		<svg ref={graph} className="graph">
			{nodes.map((e, idx) => {
				let drawnEdges = {};

				return (
					<g className="nodegroup">

					<circle
			        	//onMouseDown={() => console.log("Node mouse down")}
				        className="draggable node"
				        style={{fill: e.color || "white"}}
				        cx={e.x}
				        cy={e.y}
				        r={Mode.NODE_RADIUS}
				        id={e.id}
				      	>
				      </circle>

			      	<text className="nodelabel" x={e.x-4} y={e.y + 4}>{e.id}</text>
					</g>

			    )
			})}
			{edges.map((e, idx) => {
				const fromNode = nodes.find(node => node.id == e.from);
				const toNode = nodes.find(node => node.id == e.to);
				const intersectPoint = calculateAccurateCoords(fromNode.x, fromNode.y, toNode.x, toNode.y);
				const startPoint = calculateAccurateCoords(toNode.x, toNode.y, fromNode.x, fromNode.y);
				return (<path 
					d={`M${startPoint.x},${startPoint.y} L${intersectPoint.x},${intersectPoint.y}`}
					className="edge"
					id={`${fromNode.id} ${toNode.id}`}
				/>
				)
			})}

		</svg>			
	);
}

export default GraphBoard;