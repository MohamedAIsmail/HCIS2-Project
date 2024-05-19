import React from 'react';

const DicomImage = ({ instanceUrl }) => {
  return (
    <div>
      <img src={instanceUrl} alt="DICOM" />
    </div>
  );
};

export default DicomImage;
