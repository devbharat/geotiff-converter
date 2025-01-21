import React from 'react';

const FilePicker = ({ onSelect, inputPath }) => {
  const handleClick = async () => {
    const filePath = await window.electron.pickFile();
    if (filePath) onSelect(filePath);
  };

  // Extract just the filename
  const fileName = inputPath ? inputPath.split(/[/\\]/).pop() : '';

  return (
    <button
      onClick={handleClick}
      className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full"
      style={{ maxWidth: '100%' }}
      title={fileName} // So user can see full file name on hover
    >
      {fileName ? `Input: ${fileName}` : 'Select GeoTIFF file'}
    </button>
  );
};

export default FilePicker;
