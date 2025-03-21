import React from 'react';

const LoadingSpinner = ({ size = 40 }) => {
  return (
    <div
      className="spinner-container"
      style={{ textAlign: 'center', padding: '20px' }}
    >
      <style>
        {`@keyframes spin{
                0%{transform:rotate(0deg)}
                100%{transform:rotate(360deg)}
                }`}
      </style>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `4px solid var(--secondary-color)`,
          borderTop: `4px solid var(--primary-color)`,
          borderRadius: `50%`,
          animation: `spin 1s linear infinite`,
          display: `inline-block`,
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
