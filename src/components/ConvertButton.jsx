import React from 'react';

const ConvertButton = ({ inputPath, outputPath, setStatus }) => {
  const handleClick = async () => {
    if (!inputPath || !outputPath) {
      setStatus('Please select input and output paths.');
      return;
    }

    setStatus('Converting...');
    const result = await window.electron.convertFile(inputPath, outputPath);
    if (result.success) {
      setStatus(`Conversion successful! File saved at ${outputPath}`);
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
    >
      Convert
    </button>
  );
};

export default ConvertButton;
