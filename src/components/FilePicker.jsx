import React from 'react';

const FilePicker = ({ onSelect, inputPath }) => {
  const handleClick = async () => {
    const filePath = await window.electron.pickFile();
    if (filePath) onSelect(filePath);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full"
    >
      {inputPath ? `Input: ${inputPath}` : 'Select Input File'}
    </button>
  );
};

export default FilePicker;

