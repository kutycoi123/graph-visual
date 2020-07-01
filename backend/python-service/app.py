from flask import Flask, jsonify, request
from flask_cors import CORS
import algorithms as algo

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def test():
    return jsonify({"response": "Hello world"})

@app.route('/algo', methods=['POST'])
def runAlgo():
    data = request.json
    print(data)
    return jsonify({})
    
if __name__ == "__main__":
    app.run(debug=True,port=5000)


