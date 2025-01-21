import React from 'react';
import { Upload } from 'lucide-react';

const FilePicker = ({ onSelect, inputPath }) => {
  const handleClick = async () => {
    const filePath = await window.electron.pickFile();
    if (filePath) {
      onSelect(filePath);
    }
  };

  // Only display the file name, not the full path
  const fileName = inputPath ? inputPath.split(/[\\/]/).pop() : '';

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-between p-3 border border-dashed 
                   border-blue-300 rounded-lg hover:border-blue-500 transition-colors group"
      >
        <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <Upload className="text-blue-500" size={20} />
          <span className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {fileName || 'Select GeoTIFF file'}
          </span>
        </div>
        <span className="text-blue-500 text-sm">Browse</span>
      </button>
    </div>
  );
};

export default FilePicker;
