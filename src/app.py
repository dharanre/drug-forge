from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load the trained model
try:
    model_path = 'C:/Users/Giridharan/giti-proj/src/solubility_model.pkl'
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    raise Exception(f"Model file not found at {model_path}. Check the path and try again.")

# Function to featurize SMILES string
def featurize_smiles(smiles, radius=2, length=1024):
    try:
        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return None
        fingerprint = AllChem.GetMorganFingerprintAsBitVect(mol, radius, nBits=length)
        return np.array(fingerprint).reshape(1, -1)
    except Exception as e:
        print(f"Error in featurizing SMILES: {e}")
        return None

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the Solubility Prediction API! Use the /predict endpoint to make predictions.'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'smiles' not in data:
            return jsonify({'error': 'Missing "smiles" in request body'}), 400
        
        smiles = data.get('smiles')

        # Featurize the input SMILES string
        features = featurize_smiles(smiles)
        if features is None:
            return jsonify({'error': 'Invalid SMILES string'}), 400

        # Predict using the loaded model
        prediction = model.predict(features)

        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        print(f"Error in /predict endpoint: {e}")
        return jsonify({'error': 'An internal error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)
