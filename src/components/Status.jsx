import React from 'react';

const Status = ({ status }) => (
  <div className="text-center mt-4">
    {status && <p className="text-lg">{status}</p>}
  </div>
);

export default Status;

