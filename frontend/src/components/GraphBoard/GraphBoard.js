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

	const handleClick = (event) => {
		console.log("Svg clicked");
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
	const [handlers, setHandlers] = useState({
		click: handleClick,
		startDrag: handleStartDrag,
		dragging: handleDragging,
		endDrag: handleEndDrag
	})

	switch (mode) {
		case Mode.MOVE:
			graph.current.removeEventListener('click', handlers.click);
			graph.current.addEventListener('mousedown', handlers.startDrag);
			graph.current.addEventListener('mousemove', handlers.dragging);
			graph.current.addEventListener('mouseup', handlers.endDrag);
			break;
		case Mode.DRAW:
			graph.current.addEventListener('click', handlers.click);
		case Mode.RESET:
		case Mode.REMOVENODE:
		case Mode.REMOVEEDGE:
			graph.current.removeEventListener('mousedown', handlers.startDrag);
			graph.current.removeEventListener('mousemove', handlers.dragging);
			graph.current.removeEventListener('mouseup', handlers.endDrag);
			break;
	}

	useEffect(() => {
		switch(mode) {
			case Mode.RESET:
				setNodes([]);
				setEdges([]);
				break;
		}
	}, [mode]);
	return (
		<svg ref={graph}>
			<g className="nodegroup">
		      <circle
		        //onMouseDown={() => console.log("Node mouse down")}
		        className="draggable"
		        cx={100}
		        cy={100}
		        r={50}
		        id={3}
		      ></circle>
			</g>
		</svg>			
	);
}

export default GraphBoard;