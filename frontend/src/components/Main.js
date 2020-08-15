import React, {useState, useEffect} from 'react';
import GraphBoard from './GraphBoard/GraphBoard.js';

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
	const handleChangeMode = (mode) => {
		setMode(mode);
	}
	
	return (

		<div>
			<div className="graph-mode">
				<button onClick={() => handleChangeMode(Mode.RUN)}>Run algorithm</button>
				<select name="algo" id="algo-select" onChange={(e) => setAlgo(e.target.value)}>
					<option value="bfs">BFS</option>
					<option value="dfs">DFS</option>
					<option value="coloring">Graph coloring</option>
					<option value="dijkstra">Dijkstra</option>
					<option value="mst">MST-Kruskal</option>
				</select>
				<select name="service" id="service-select" onChange={(e) => setService(e.target.value)}>
					<option value="python">Python</option>
					<option value="go">Golang</option>
				</select>				
				<button onClick={() => handleChangeMode(Mode.DRAWNODE)}>Draw node</button>
				<button onClick={() => handleChangeMode(Mode.MOVE)}>Move node</button>
				<button onClick={() => handleChangeMode(Mode.REMOVENODE)}>Remove node</button>
				<button onClick={() => handleChangeMode(Mode.DRAWEDGE)}>Draw edge</button>
				<button onClick={() => handleChangeMode(Mode.REMOVEEDGE)}>Remove edge</button>
				<button onClick={() => handleChangeMode(Mode.RESET)}>Reset</button>
				<button onClick={() => handleChangeMode(Mode.RESETCOLOR)}>Reset color</button>
			</div>
			<div className="graph-board">
				<GraphBoard 
					mode={mode}
					algo={algo}
					service={service}
					handleChangeMode={handleChangeMode}
				/>
			</div>
		</div>
	);
}


export default Main;