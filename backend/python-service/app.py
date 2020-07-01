from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route('/', methods=['GET'])
def test():
    return jsonify({"response": "Hello world"})

@app.route('/algo', methods=['POST'])
def runAlgo():
    data = request.json
    print(data, type(data))
    return jsonify({})
    
if __name__ == "__main__":
    app.run(debug=True,port=5000)


