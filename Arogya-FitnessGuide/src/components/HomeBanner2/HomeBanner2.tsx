import React, { useState } from 'react';
import './HomeBanner2.css'; // Import your CSS file for styling

const HomeBanner2: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmi, setBMI] = useState<number | null>(null);

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum > 0 && heightNum > 0) {
      const heightMeters = heightNum / 100;
      const bmiValue = weightNum / (heightMeters * heightMeters);
      setBMI(bmiValue);
    } else {
      setBMI(null);
    }
  };

  return (
    <div className="bmi-calculator">
        
      <h1>Calculate Your BMI</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateBMI();
        }}
      >
        <div className="form-group">
          <label htmlFor="weight">Enter your weight (kg):</label>
          <input
            type="text"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="height">Enter your height (cm):</label>
          <input
            type="text"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
        <button type="submit">Calculate BMI</button>
      </form>
      {bmi !== null && (
        <div className="result">
          <h2>Your BMI: {bmi.toFixed(2)}</h2>
        </div>
      )}
      </div>

  );
};

export default HomeBanner2;
