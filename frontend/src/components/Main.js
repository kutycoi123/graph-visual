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
	const handleChangeMode = (mode) => {
		switch (mode) {
			case Mode.RESET: 
				setMode(mode);
				break;
			case Mode.RUN:
				break;
		}
		setMode(mode);
	}
	
	return (

		<div>
			<div className="graph-mode">
				<button onClick={() => handleChangeMode(Mode.RUN)}>Run algorithm</button>
				<button onClick={() => handleChangeMode(Mode.DRAW)}>Draw node</button>
				<button onClick={() => handleChangeMode(Mode.MOVE)}>Move node</button>
				<button onClick={() => handleChangeMode(Mode.REMOVENODE)}>Remove node</button>
				<button onClick={() => handleChangeMode(Mode.REMOVEEDGE)}>Remove edge</button>
				<button onClick={() => handleChangeMode(Mode.RESET)}>Reset</button>
			</div>
			<div className="graph-board">
				<GraphBoard 
					mode={mode}
				/>
			</div>
		</div>
	);
}


export default Main;