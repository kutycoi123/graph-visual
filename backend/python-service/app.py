from flask import Flask, jsonify, request
from flask_cors import CORS
import algorithms as algo

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def test():
    return jsonify({"response": "Hello world"})

@app.route('/algo/bfs', methods=['POST'])
def runBfs():
    data = request.json
    startNode = data["startNode"]
    nodes = data["nodes"]
    edges = data["edges"]
    bfs = algo.BFS(nodes,startNode,None)
    trace = bfs.run()
    return jsonify(trace)

@app.route('/algo/dfs', methods=['POST'])
def runDfs():
    data = request.json
    startNode = data["startNode"]
    nodes = data["nodes"]
    edges = data["edges"]
    dfs = algo.DFS(nodes, startNode, None)
    trace = dfs.run()
    return jsonify(trace)

@app.route('/algo/coloring', methods=['POST'])
def runGraphColoring():
    data = request.json
    nodes = data["nodes"]
    for nColors in range(1, len(nodes)+1):
        graph = algo.GraphColoring(nodes=nodes, nColors=7);
        sol = graph.backtrack_search()
        if sol:
            return jsonify(sol)
    return jsonify({})

if __name__ == "__main__":
    app.run(debug=True,port=5000)


