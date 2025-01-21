import React from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

const Status = ({ status }) => {
  if (!status.message) return null;

  return (
    <div
      className={`flex items-center justify-center space-x-2 p-3 rounded-lg text-center
        ${
          status.type === 'error'
            ? 'text-red-600 bg-red-50'
            : status.type === 'success'
            ? 'text-green-600 bg-green-50'
            : 'text-blue-600 bg-blue-50'
        }`}
    >
      {status.type === 'error' && <AlertCircle size={20} />}
      {status.type === 'success' && <Check size={20} />}
      {status.type === 'progress' && <Loader2 className="animate-spin" size={20} />}
      <span>{status.message}</span>
    </div>
  );
};

export default Status;
