import React, { useState } from 'react';
import { FileOutput, Loader2 } from 'lucide-react';

const ConvertButton = ({ inputPath, outputPath, setStatus }) => {
  const [isConverting, setIsConverting] = useState(false);

  const handleClick = async () => {
    if (!inputPath || !outputPath) {
      setStatus({ type: 'error', message: 'Please select input and output paths.' });
      return;
    }

    setIsConverting(true);
    setStatus({ type: 'progress', message: 'Converting...' });

    try {
      const result = await window.electron.convertFile(inputPath, outputPath);
      if (result.success) {
        setStatus({ type: 'success', message: 'Conversion successful!' });
      } else {
        setStatus({ type: 'error', message: result.error || 'Conversion failed.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isConverting || !inputPath || !outputPath}
      className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors
                 flex items-center justify-center space-x-2"
    >
      {isConverting ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <FileOutput size={20} />
      )}
      <span>{isConverting ? 'Converting...' : 'Convert'}</span>
    </button>
  );
};

export default ConvertButton;
