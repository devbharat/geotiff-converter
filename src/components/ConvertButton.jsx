import React, { useState, useEffect } from 'react';

const ConvertButton = ({ inputPath, outputPath, setStatus }) => {
  const [progress, setProgress] = useState(0); // Progress state (0 to 100)
  const [isConverting, setIsConverting] = useState(false); // Conversion state

  useEffect(() => {
    const ipcRenderer = window.electron.ipcRenderer;

    // Listen for progress updates
    ipcRenderer.on('conversion-progress', (event, progressValue) => {
      setProgress(Number(progressValue)); // Update progress state
    });

    return () => {
      ipcRenderer.removeAllListeners('conversion-progress');
    };
  }, []);

  const handleConversion = async () => {
    if (!inputPath || !outputPath) {
      setStatus({ type: 'error', message: 'Please select input and output paths.' });
      return;
    }

    const electron = window.electron;

    setProgress(0); // Reset progress
    setIsConverting(true); // Indicate conversion is in progress
    setStatus({ type: 'progress', message: 'Starting conversion...' });

    try {
      const result = await electron.convertFile(inputPath, outputPath);

      if (result.success) {
        setStatus({ type: 'success', message: 'Conversion completed successfully!' });
      } else {
        setStatus({ type: 'error', message: `Conversion failed: ${result.error}` });
      }
    } catch (error) {
      setStatus({ type: 'error', message: `An error occurred: ${error.message}` });
    } finally {
      setIsConverting(false); // Reset conversion state
    }
  };

  return (
    <button
      className="relative w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center"
      onClick={handleConversion}
      disabled={isConverting} // Disable button during conversion
    >
      {isConverting ? (
        <div className="relative w-6 h-6">
          {/* Circular progress indicator */}
          <svg className="absolute inset-0 w-full h-full transform rotate-[-90deg]" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#e5e7eb" // Background circle color (gray)
              strokeWidth="4"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#4ade80" // Progress circle color (green)
              strokeWidth="4"
              strokeDasharray="100"
              strokeDashoffset={100 - progress} // Adjust offset based on progress
            />
          </svg>
        </div>
      ) : (
        'Convert'
      )}
    </button>
  );
};

export default ConvertButton;
