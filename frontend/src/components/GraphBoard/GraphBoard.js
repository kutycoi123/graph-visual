import React, {useState, useRef, useEffect} from 'react';
import {Mode, NODE_RADIUS, COLOR_MAPPING, CREATE_UNDIRECTIONAL_GRAPH} from '../constants.js';
import axios from 'axios';
import './GraphBoard.css';

const URL = "http://localhost:5000";
const calculateCurve = ( x1, y1, x2, y2 ) => {
  let theta = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
  let offset = 50;
  let x = (x2 + x1) * 0.5 + offset * Math.cos(theta);
  let y = (y2 + y1) * 0.5 + offset * Math.sin(theta);
  return {x, y};
};
const calculateIntersection = (x1, y1, x2, y2) => {
  let dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  let ratio = (dist - NODE_RADIUS) / dist; 
  let dx = (x2 - x1) * ratio;
  let dy = (y2 - y1) * ratio;
  let intersectX = x1 + dx;
  let intersectY = y1 + dy;
  return { x: intersectX, y: intersectY };
};

function GraphBoard(props) {
	let random_graph = CREATE_UNDIRECTIONAL_GRAPH(5);

	const [nodes, setNodes] = useState(random_graph.nodes);
	const [edges, setEdges] = useState(random_graph.edges);
	const [nodeCnt, setNodeCnt] = useState(nodes.length);
	const [pairNode, setPairNode] = useState({
		from: undefined,
		to: undefined
	});
	const [colorReset, setColorReset] = useState(true);

	const {
		mode, algo, service, handleChangeMode
	} = props;
	const graph = useRef();
	const clickedNode = useRef();


	const resetAlgo = () => {
		let newNodes = nodes.map(e => {
			return {...e, color: "white"};
		});
		let newEdges = edges.map(e => {
			return {...e, color: "white"}
		})
		setNodes(newNodes);
		setEdges(newEdges);
		setColorReset(true);
	}

	const replaceNode = (id, newAttributes, nodes) => {
		const idx = nodes.findIndex(e => e.id === id);
		if (idx > -1) {
			const newNodes = [...nodes];
			newNodes[idx] = {...nodes[idx], ...newAttributes};
			return newNodes;
		}
		return nodes;
	}
	const replaceEdge = (from, to, newAttributes, edges) => {
		const idx = edges.findIndex(e => e.from === from && e.to === to);
		if (idx > -1) {
			const newEdges = [...edges];
			newEdges[idx] = {...edges[idx], ...newAttributes};
			return newEdges;
		}
		return edges;
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
			console.log(event);
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
						//toNode.neighbors.push(fromNode.id);
						const newEdges = [...edges, {from: fromNode.id, to: toNode.id, weight: 0, id: `${fromNode.id} ${toNode.id}`}]
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
			const newEdges = edges.filter(e => e.from !== fromId || e.to !== toId)
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
			clickedNode.current.nextElementSibling.setAttribute("x", x);
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
			} else if (mode === Mode.RESETGRAPH) {
				graph.current.onclick = undefined;
			}
			graph.current.onmousedown = undefined;
			graph.current.onmousemove = undefined;
			graph.current.onmouseup = undefined;
		}
	}
	useEffect(() => {
		if (mode === Mode.RESETGRAPH) {
			setEdges([]);
			setNodes([]);
			setColorReset(true);
			setNodeCnt(0);
		} else if (mode === Mode.RUN) {
			if (!colorReset) {
				alert("Please reset the color to visualize the algorithm");
			}
			else if (nodes.length == 0) {
				alert("Please add some nodes in order to run algorithms");
			} else if (algo === 'bfs' || algo === 'dfs') {
				axios({
					url: `${URL}/api/${service}/${algo}`,
					method: "post",
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"nodes": nodes.map(e => {
							return {id: e.id, neighbors: e.neighbors};
						}),
						"edges": edges,
						"startNode": {id: nodes[0].id, neighbors: nodes[0].neighbors}
					}
				}).then(res => {
					let trace = res.data;
					let i = 1;
					let newNodes = nodes;
					let newEdges = edges;
					for (let node of trace) {
						let colorEdge = setTimeout(() => {
							newEdges = replaceEdge(node.parent, node.id, {color: "green"}, newEdges);
							//newEdges = replaceEdge(node.id, node.parent, {color: "green"}, newEdges);
							setEdges(newEdges);
							clearTimeout(colorEdge);
						}, 500*i);
						let colorNode = setTimeout(() => {
							newNodes = replaceNode(node.id, {color: "red"}, newNodes);
							setNodes(newNodes);
							clearTimeout(colorNode);
						}, 501*i)
						i++;
					}		
					setColorReset(false);
				}).catch(e => {

				})
			} else if (algo == "coloring") {
				let nodes_dict = {};
				nodes.map(e => nodes_dict[e.id] = e.neighbors);
				axios({
					url: `${URL}/api/${service}/${algo}`,
					method: "post",
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"nodes": nodes.map(e => {
							return {id: e.id, neighbors: e.neighbors};
						}),
						"edges": edges,
					}
				}).then(res => {
					let colors = res.data
					let coloredNodes = nodes.map(e => {
						return {...e, color: COLOR_MAPPING[colors[e.id]]}
					});
					let i = 1;
					let newNodes = nodes;
					for (let node of coloredNodes) {
						let colorNodeHandler = setTimeout(() => {
							newNodes = replaceNode(node.id, {color: node.color}, newNodes);
							setNodes(newNodes);
							clearTimeout(colorNodeHandler);
						}, 500*i);
						i++;
					}
					setColorReset(false);
				})
			} else if (algo == "dijkstra") {
				axios({
					url: `${URL}/api/${service}/${algo}`,
					method: "post",
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"nodes": nodes.map(e => {
							return {id: e.id, neighbors: e.neighbors};
						}),
						"edges": edges,
						"startNode": {id: nodes[0].id, neighbors: nodes[0].neighbors}
					}
				}).then(res => {
					let trace = res.data;
					let i = 1;
					let newNodes = nodes;
					let newEdges = edges;
					console.log(trace)
					for (let node of trace) {
						if (node.status=="visited") {
							let colorNode = setTimeout(() => {
								newNodes = replaceNode(node.id, {color: "red"}, newNodes);
								setNodes(newNodes);
								clearTimeout(colorNode);
							}, 1000*i)
							let colorEdge = setTimeout(() => {
								newEdges = replaceEdge(node.parent, node.id, {color: "green"}, newEdges);
								//newEdges = replaceEdge(node.id, node.parent, {color: "green"}, newEdges);
								setEdges(newEdges);
								clearTimeout(colorEdge);
							}, 1002*i);							        
						} else {
							let colorEdge1 = setTimeout(() => {
								newEdges = replaceEdge(node.parent, node.id, {color: "red"}, newEdges);
								//newEdges = replaceEdge(node.id, node.parent, {color: "green"}, newEdges);
								setEdges(newEdges);														
								clearTimeout(colorEdge1);
								let colorEdge2 = setTimeout(() => {
									newEdges = replaceEdge(node.parent, node.id, {color: "white"}, newEdges);
									//newEdges = replaceEdge(node.id, node.parent, {color: "green"}, newEdges);
									setEdges(newEdges);
									clearTimeout(colorEdge2);
								}, 1000);
							}, 1001*i);	
							
						}
						i++;
					}
					setColorReset(false);					
				})
			} else if(algo == "mst") {

				axios({
					url: `${URL}/api/${service}/${algo}`,
					method: "post",
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"nodes": nodes.map(e => {
							return {id: e.id, neighbors: e.neighbors};
						}),
						"edges": edges,
					}
				}).then(res => {
					let mst = res.data;
					let newEdges = [...edges];
					let i = 0;
					for (let edge of mst) {
						let colorEdge = setTimeout(() => {
							newEdges = replaceEdge(edge.from, edge.to, {color: "green"}, newEdges);
							//newEdges = replaceEdge(node.id, node.parent, {color: "green"}, newEdges);
							setEdges(newEdges);
							clearTimeout(colorEdge);
						}, 700*i);
						i++;
					}						
					setColorReset(false);	
				})
			}
			handleChangeMode(Mode.FINISH);
		} else if (mode == Mode.RESETALGO) {
			resetAlgo();
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
				        r={NODE_RADIUS}
				        id={e.id}
				      	>
				      </circle>

			      	<text className="nodelabel" x={e.x} y={e.y+4}>{e.id}</text>
					</g>

			    )
			})}
			{edges.map((e, idx) => {
				const fromNode = nodes.find(node => node.id == e.from);
				const toNode = nodes.find(node => node.id == e.to);
				const intersectPoint1 = calculateIntersection(fromNode.x, fromNode.y, toNode.x, toNode.y);
				const intersectPoint2 = calculateIntersection(toNode.x, toNode.y, fromNode.x, fromNode.y);
				const midpoint = calculateCurve(intersectPoint2.x, intersectPoint2.y, intersectPoint1.x, intersectPoint1.y);
				return (
					<g>
					<marker
	                    className={"arrow"}
	                    id={`arrowhead${e.from}${e.to}`}
	                    markerWidth="10"
	                    markerHeight="7"
	                    refX="8.7"
	                    refY="3.5"
	                    orient="auto"
                  	>
                    	<polygon points="0 0, 10 3.5, 0 7" />
                  	</marker>
					<path 
						d={`M${intersectPoint2.x} ${intersectPoint2.y} Q${midpoint.x} ${midpoint.y} ${intersectPoint1.x} ${intersectPoint1.y}`}
						className="edge"
						id={e.id}
						style={{stroke: e.color || "white"}}
						markerEnd={`url(#arrowhead${e.from}${e.to})`}
						onClick={() => {
							if (mode == Mode.REMOVEEDGE) {
								return;
							}
							let weight = parseInt(prompt(`Please set a weight for edge from node ${e.from} to node ${e.to}`));
							if (weight >= 0) {
								let newEdges = [...edges];
								let edge = newEdges.find(edge => e.id == edge.id);
								edge.weight = weight;
								setEdges(newEdges);
							}else if(weight < 0) {
								alert("Weight must be a number and non-negative")
							}

						}}
					/>
					<text
                      className="edge-weight"
                      x={Math.atan2(fromNode.y-toNode.y, fromNode.x-toNode.x) < 0 ? midpoint.x : midpoint.x }
                      y={Math.atan2(fromNode.y-toNode.y, fromNode.x-toNode.x) < 0 ? midpoint.y - 5 : midpoint.y + 5 }
                    >
                      {e.weight}
                    </text>
					</g>
				)
			})}

		</svg>	

	
	);
}

export default GraphBoard;