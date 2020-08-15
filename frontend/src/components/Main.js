import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import GraphBoard from './GraphBoard/GraphBoard.js';
import classnames from 'classnames';
import {Mode} from './constants.js';

/*
Node: {
	id,x,y,color,neighbors
}
Edge: {
	id, start(id of start node), end(id of end node)
}

*/
function Main() {

	const [mode, setMode] = useState();
	const [algo, setAlgo] = useState("bfs");
	const [service, setService] = useState("python");
	const [showModal, setShowModal] = useState(true);
	const handleChangeMode = (mode) => {
		setMode(mode);
	}	
	const handleClose = () => setShowModal(false);
  	const handleShow = () => setShowModal(true);
	return (

		<div>
			<div className="header">
			<form>
				<div className="form-group row">
					<label className="col-sm-2 col-form-label" for="algo-select">Choose an algorithm:</label>
					<div className="col-sm-10">
						<select name="algo" id="algo-select" onChange={(e) => setAlgo(e.target.value)}>
							<option value="bfs">Breadth First Search</option>
							<option value="dfs">Depth First Search</option>
							<option value="coloring">Graph coloring with minimum number of colors</option>
							<option value="dijkstra">Shortest Path - Dijkstra algorithm</option>
							<option value="mst">Minimum Spanning Tree - Kruskal algorithm</option>
						</select>
					</div>
				</div>
				<div className="form-group row">
					<label className="col-sm-2 col-form-label" for="service-select">Choose a server:</label>
					<div className="col-sm-10">
						<select name="service" id="service-select" onChange={(e) => setService(e.target.value)}>
							<option value="python">Python</option>
							<option value="go">Golang</option>
						</select>
					</div>
				</div>
			</form>
			<div className="row">
				<button className={classnames({"btn_focus": mode==Mode.RUN})}
					onClick={() => handleChangeMode(Mode.RUN)}>Run algorithm</button>
				<button 
					className={classnames({"btn_focus": mode==Mode.DRAWNODE})}
					onClick={() => handleChangeMode(Mode.DRAWNODE)}
				>
						Draw node
				</button>
				<button 
					className={classnames({"btn_focus": mode==Mode.MOVE})}
					onClick={() => handleChangeMode(Mode.MOVE)}
				>
					Move node
				</button>
				<button 
					className={classnames({"btn_focus": mode==Mode.REMOVENODE})}
					onClick={() => handleChangeMode(Mode.REMOVENODE)}
				>
					Remove node
				</button>
				<button 
					className={classnames({"btn_focus": mode==Mode.DRAWEDGE})}
					onClick={() => handleChangeMode(Mode.DRAWEDGE)}
				>
					Draw edge
				</button>
				<button 
					className={classnames({"btn_focus": mode==Mode.REMOVEEDGE})}
					onClick={() => handleChangeMode(Mode.REMOVEEDGE)}
				>
					Remove edge
				</button>
				<button 
					className={classnames({"btn_focus": mode==Mode.RESETALGO})}
					onClick={() => handleChangeMode(Mode.RESETALGO)}
				>
					Reset algorithm
				</button>				
				<button 
					className={classnames({"btn_focus": mode==Mode.RESETGRAPH})}
					onClick={() => handleChangeMode(Mode.RESETGRAPH)}
				>
					Reset graph
				</button>
				<button 
					onClick={handleShow}
				>
					Instructions
				</button>				
			</div>
			</div>
			<div className="graph-board">
				<GraphBoard 
					mode={mode}
					algo={algo}
					service={service}
					handleChangeMode={handleChangeMode}
				/>
			</div>
			<Modal show={showModal} onHide={handleClose}>
		        <Modal.Header closeButton>
		          <Modal.Title>App instructions</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
					This app is developed to visualize some graph algorithms.
					<p>There are a header, which includes buttons, and canvas, which is the main area to display graph</p>
		        	<p>There are 9 buttons on the header, all of which will help you interact with graph 
		        	by specific operations:</p>
		        	<p>1.<strong>Run algorithm</strong>: Send request to run an algorithm to a chosen server</p>
		        	<p>2.<strong>Draw node</strong>: Draw nodes by clicking on canvas</p>
		        	<p>3.<strong>Move node</strong>: Move nodes around by dragging them</p>
		        	<p>4.<strong>Remove node</strong>: Remove nodes by clicking on them</p>
		        	<p>5.<strong>Draw edge</strong>: Draw a new edge by clicking a source node(red) and a target node(green).</p>
		        	<p>6.<strong>Remove edge</strong>: Remove edges by clicking on them</p>
		        	<p>7.<strong>Reset algorithm</strong>: Reset the algorithm and reset color to run new one</p>
		        	<p>8.<strong>Reset graph</strong>: Remove all nodes and edges</p>
		        	<p>9.<strong>Instruction</strong>: Display instruction</p>
		        	<p><strong>Note</strong>: You can edit edge weight by clicking on each edge. 
					   You can only do this when you are not in "Remove edge" mode.
					</p>
		        </Modal.Body>
		        <Modal.Footer>
		          <Button variant="secondary" onClick={handleClose}>
		            Close
		          </Button>
		        </Modal.Footer>
		    </Modal>
		</div>
	);
}


export default Main;