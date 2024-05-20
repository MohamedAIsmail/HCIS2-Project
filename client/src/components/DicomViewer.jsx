import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DicomViewer.css'; // Ensure you have this CSS file or add the styles directly in your component

const DicomViewer = () => {
  const { patientId } = useParams();
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      console.log("Fetching image for scan ID:", patientId);
      try {
        // Fetch all studies for the patient
        let response = await fetch(`http://localhost:80/orthanc/dicom-web/studies?patientId=${patientId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch studies: ${response.statusText}`);
        }
        const studies = await response.json();
        if (studies.length === 0) {
          throw new Error('No studies found for this patient.');
        }

        // Choose the newest study
        const newestStudy = studies.reduce((prevStudy, currentStudy) => {
          return new Date(currentStudy.StudyDate) > new Date(prevStudy.StudyDate) ? currentStudy : prevStudy;
        });

        console.log('Newest study:', newestStudy['0020000D'].Value[0]);

        // Fetch all series for the newest study
        response = await fetch(`http://localhost:80/orthanc/dicom-web/studies/${newestStudy['0020000D'].Value[0]}/series`);
        if (!response.ok) {
          throw new Error(`Failed to fetch series: ${response.statusText}`);
        }
        const series = await response.json();
        if (series.length === 0) {
          throw new Error('No series found for this study.');
        }

        // Choose the newest series
        const newestSeries = series.reduce((prevSeries, currentSeries) => {
          return new Date(currentSeries.SeriesDate) > new Date(prevSeries.SeriesDate) ? currentSeries : prevSeries;
        });

        // Fetch all instances for the newest series
        response = await fetch(`http://localhost:80/orthanc/dicom-web/studies/${newestStudy['0020000D'].Value[0]}/series/${newestSeries['0020000E'].Value[0]}/instances`);
        if (!response.ok) {
          throw new Error(`Failed to fetch instances: ${response.statusText}`);
        }
        const instances = await response.json();
        if (instances.length === 0) {
          throw new Error('No instances found for this series.');
        }

        // Choose the newest instance
        const newestInstance = instances.reduce((prevInstance, currentInstance) => {
          return new Date(currentInstance.InstanceCreationDate) > new Date(prevInstance.InstanceCreationDate) ? currentInstance : prevInstance;
        });

        // Fetch the rendered image for the newest instance
        const url = `http://localhost:80/orthanc/dicom-web/studies/${newestStudy['0020000D'].Value[0]}/series/${newestSeries['0020000E'].Value[0]}/instances/${newestInstance['00080018'].Value[0]}/rendered`;
        response = await fetch(url, {
          headers: {
            'Accept': 'image/jpeg',
          }
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const blob = await response.blob();
        const originalImageUrl = URL.createObjectURL(blob);
        console.log('Original Image URL:', originalImageUrl);
        setOriginalImageUrl(originalImageUrl);

        // Send a POST request to FastAPI with the rendered image
        const formData = new FormData();
        formData.append('file', blob, 'image.png');

        console.log('Sending image to FastAPI for processing...');
        response = await fetch('http://127.0.0.1:8000/segment', {
          method: 'POST',
          body: formData,
        });

        console.log('Response:', response);
        if (!response.ok) {
          throw new Error(`Failed to process image: ${response.statusText}`);
        }


        const processedBlob = await response.blob();
        const processedImageUrl = URL.createObjectURL(processedBlob);
        console.log('Processed Image URL:', processedImageUrl);
        setProcessedImageUrl(processedImageUrl);
      } catch (error) {
        console.error('Error fetching rendered DICOM image:', error);
        setError(error.message);
      }
    };

    fetchImage();
  }, [patientId]);

  return (
    <div>
  {error && <p>Error: {error}</p>}
  <div className="image-container">
    {originalImageUrl && (
      <div className="image-wrapper" style={{ width: "300px", height: "300px" }}>
        <p>Original Image:</p>
        <img src={originalImageUrl} alt="Original DICOM Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    )}
    {processedImageUrl && (
      <div className="image-wrapper" style={{ width: "300px", height: "300px" }}>
        <p>Processed Image:</p>
        <img src={processedImageUrl} alt="Processed DICOM Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    )}
  </div>
</div>

  );
};

export default DicomViewer;
