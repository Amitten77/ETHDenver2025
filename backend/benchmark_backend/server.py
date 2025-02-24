from flask import Flask, jsonify, request
from benchmarks.sentiment_benchmark import run_sentiment_test


app = Flask(__name__)


@app.route('/get_benchmark', methods=['GET'])
def get_benchmark():
    query = request.args.get('query', '').lower()  # Get query parameter
    data = {"sentiment"}
    if query in data:
        # Run python file in benchmarks folder
        if query == "sentiment":
            data = run_sentiment_test()
            return jsonify(data)
    else:
        return jsonify({"success": False, "error": "Query not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5179, debug=True)