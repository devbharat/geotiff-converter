import React from 'react';

const OutputPath = ({ onSelect, outputPath }) => {
  const handleClick = async () => {
    const filePath = await window.electron.pickSaveLocation();
    if (filePath) onSelect(filePath);
  };

  // Extract just the filename
  const fileName = outputPath ? outputPath.split(/[/\\]/).pop() : '';

  return (
    <button
      onClick={handleClick}
      className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full"
      style={{ maxWidth: '100%' }}
      title={fileName}
    >
      {fileName ? `Output: ${fileName}` : 'Choose save location'}
    </button>
  );
};

export default OutputPath;
