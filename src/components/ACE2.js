// ACE2Predictor.js
import React, { useState } from "react";
import { XCircle } from "lucide-react";

const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #87CEEB, #6495ED)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const cardStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  maxWidth: "500px",
  width: "100%",
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#2196F3",
  marginBottom: "20px",
  textAlign: "center",
};

const infoStyle = {
  fontSize: "16px",
  color: "#666666",
  marginBottom: "20px",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const labelStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333333",
  marginBottom: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #CCCCCC",
  borderRadius: "5px",
  outline: "none",
  transition: "all 0.2s ease-in-out",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#FFFFFF",
  backgroundColor: "#2196F3",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
};

const errorStyle = {
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#FFC080",
  border: "1px solid #FF9900",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
};

const resultStyle = {
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#F7F7F7",
  border: "1px solid #CCCCCC",
  borderRadius: "5px",
};

const resultTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#333333",
  marginBottom: "10px",
};

const resultTextStyle = {
  fontSize: "16px",
  color: "#666666",
};

const ACE2Predictor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ smiles: "" });
  const [prediction, setPrediction] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePredictClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowResult(false);

    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setPrediction(data.prediction[0]); // Extract the first (and only) prediction value
      setShowResult(true);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching the prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>ACE2 Binding Affinity Prediction</h1>
        <p style={infoStyle}>
          Predict the binding affinity of a compound with ACE2 using its SMILES string.
        </p>
        <form onSubmit={handlePredictClick} style={formStyle}>
          <div>
            <label style={labelStyle} htmlFor="smiles">
              Enter SMILES String:
            </label>
            <input
              type="text"
              id="smiles"
              name="smiles"
              value={formData.smiles}
              onChange={handleChange}
              placeholder="e.g., CC(=O)OC1=CC=CC=C1C(=O)O"
              style={inputStyle}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={buttonStyle}
          >
            {isLoading ? "Predicting..." : "Predict"}
          </button>
        </form>
        {error && (
          <div style={errorStyle}>
            <XCircle style={{ marginRight: "10px", color: "#FF9900" }} />
            <p>{error}</p>
          </div>
        )}
        {showResult && (
          <div style={resultStyle}>
            <h2 style={resultTitleStyle}>Prediction Result:</h2>
            <p style={resultTextStyle}>
              <strong>Predicted Value:</strong> {prediction.toFixed(4)}
            </p>
            <p style={resultTextStyle}>
              {prediction > 0
                ? "The compound has a high binding affinity with ACE2."
                : "The compound has a low binding affinity with ACE2."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ACE2Predictor;
