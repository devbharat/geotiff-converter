import React, { useState } from 'react';
import FilePicker from './components/FilePicker';
import OutputPath from './components/OutputPath';
import ConvertButton from './components/ConvertButton';
import Status from './components/Status';

const App = () => {
  const [inputPath, setInputPath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [status, setStatus] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">GeoTIFF Converter</h1>
      <div className="space-y-4 w-96">
        <FilePicker onSelect={setInputPath} inputPath={inputPath} />
        <OutputPath onSelect={setOutputPath} outputPath={outputPath} />
        <ConvertButton
          inputPath={inputPath}
          outputPath={outputPath}
          setStatus={setStatus}
        />
        <Status status={status} />
      </div>
    </div>
  );
};

export default App;

