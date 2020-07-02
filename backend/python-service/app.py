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
if __name__ == "__main__":
    app.run(debug=True,port=5000)


