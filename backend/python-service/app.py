from flask import Flask, jsonify, request
from flask_cors import CORS
import algorithms as algo
import json
import zmq
import logging

app = Flask(__name__)
CORS(app)
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

@app.route('/', methods=['GET'])
def test():
    return jsonify({"response": "Hello world"})

@app.route('/api/python/bfs', methods=['POST'])
def bfs_python():
    data = request.json
    startNode = data["startNode"]
    nodes = data["nodes"]
    edges = data["edges"]
    bfs = algo.BFS(nodes,startNode,None)
    trace = bfs.run()
    return jsonify(trace)

@app.route('/api/python/dfs', methods=['POST'])
def dfs_python():
    data = request.json
    startNode = data["startNode"]
    nodes = data["nodes"]
    edges = data["edges"]
    dfs = algo.DFS(nodes, startNode, None)
    trace = dfs.run()
    return jsonify(trace)

@app.route('/api/python/coloring', methods=['POST'])
def graphColoring_python():
    data = request.json
    nodes = data["nodes"]
    for nColors in range(1, len(nodes)+1):
        graph = algo.GraphColoring(nodes=nodes, nColors=7);
        sol = graph.backtrack_search()
        if sol:
            return jsonify(sol)
    return jsonify({})
@app.route('/api/go/bfs', methods=['POST'])
def bfs_go():
    data = request.json
    startNode = data["startNode"]
    nodes = data["nodes"]
    edges = data["edges"]   
    context = zmq.Context()
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5555")
    reqData = {"graph": data, "algo": "bfs"}
    req = json.dumps(reqData).encode('utf8')
    socket.send(req)
    res = socket.recv()
    response = json.loads(res.decode('utf-8'))
    return jsonify(response)

@app.route('/api/go/dfs', methods=['POST'])
def dfs_go():
    data = request.json
    startNode = data["startNode"]
    nodes = data["nodes"]
    edges = data["edges"]   
    context = zmq.Context()
    socket = context.socket(zmq.REQ)
    socket.connect("tcp://localhost:5555")
    reqData = {"graph": data, "algo": "dfs"}
    req = json.dumps(reqData).encode('utf8')
    socket.send(req)
    res = socket.recv()
    response = json.loads(res.decode('utf-8'))
    return jsonify(response)    
if __name__ == "__main__":
    app.run(debug=False,host='0.0.0.0',port=5000)


