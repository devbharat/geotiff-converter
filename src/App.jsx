import React, { useState } from 'react';
import FilePicker from './components/FilePicker';
import OutputPath from './components/OutputPath';
import ConvertButton from './components/ConvertButton';
import Status from './components/Status';

const App = () => {
  const [inputPath, setInputPath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"> {/* Added flex utilities */}
      <div className="max-w-xl w-full mx-4 bg-white rounded-3xl shadow-xl p-8"> {/* Added w-full and mx-4 for responsiveness */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          GeoTIFF Converter
        </h1>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Input File</label>
            <FilePicker onSelect={setInputPath} inputPath={inputPath} />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Output Location</label>
            <OutputPath onSelect={setOutputPath} outputPath={outputPath} />
          </div>

          <div className="mt-8">
            <ConvertButton
              inputPath={inputPath}
              outputPath={outputPath}
              setStatus={setStatus}
            />
          </div>

          {status.message && (
            <div className="mt-4">
              <Status status={status} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;