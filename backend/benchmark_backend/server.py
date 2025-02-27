from flask import Flask, jsonify, request
from benchmarks.fetal_health_benchmark import run_fetal_health_benchmark
from benchmarks.alzheimers_mri_benchmark import run_alzheimers_mri_benchmark
from benchmarks.stroke_risk_benchmark import run_stroke_risk_benchmark


app = Flask(__name__)


@app.route('/get_benchmark', methods=['GET'])
def get_benchmark():
    # Get model and benchmark from query
    benchmarks = ["alzheimers", "stroke_risk", "fetal_health"]
    model = request.args.get('model')
    benchmark = request.args.get('benchmark')

    print(model, benchmark)

    if benchmark not in benchmarks:
        return jsonify({"success": False, "error": "Benchmark not found"}), 404
    else:
        if benchmark == "alzheimers":
            data = run_alzheimers_mri_benchmark(model)
        elif benchmark == "stroke_risk":
            data = run_stroke_risk_benchmark(model)
        elif benchmark == "fetal_health":
            data = run_fetal_health_benchmark(model)
        return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5179, debug=True)