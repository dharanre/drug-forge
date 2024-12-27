from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import pickle

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

@app.route('/')
def home():
    return "DrugForge API is up and running on Render!"

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded properly"}), 500
    
    try:
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)  # Reshape for sklearn
        prediction = model.predict(features)
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
