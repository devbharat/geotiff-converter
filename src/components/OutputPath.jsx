import React from 'react';

const OutputPath = ({ onSelect, outputPath }) => {
  const handleClick = async () => {
    const filePath = await window.electron.pickSaveLocation(); // Use contextBridge API
    if (filePath) onSelect(filePath);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full"
    >
      {outputPath ? `Output: ${outputPath}` : 'Select Output Location'}
    </button>
  );
};

export default OutputPath;
