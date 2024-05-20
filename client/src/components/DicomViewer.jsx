import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DicomImage from './DicomImage';



const DicomViewer = () => {
  const { patientId } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
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
        const studyInstanceUID = studies[0]['0020000D'].Value[0];

        // Fetch all series for the first study
        response = await fetch(`http://localhost:80/orthanc/dicom-web/studies/${studyInstanceUID}/series`);
        if (!response.ok) {
          throw new Error(`Failed to fetch series: ${response.statusText}`);
        }
        const series = await response.json();
        if (series.length === 0) {
          throw new Error('No series found for this study.');
        }
        const seriesInstanceUID = series[0]['0020000E'].Value[0];

        // Fetch all instances for the first series
        response = await fetch(`http://localhost:80/orthanc/dicom-web/studies/${studyInstanceUID}/series/${seriesInstanceUID}/instances`);
        if (!response.ok) {
          throw new Error(`Failed to fetch instances: ${response.statusText}`);
        }
        const instances = await response.json();
        if (instances.length === 0) {
          throw new Error('No instances found for this series.');
        }
        const instanceUID = instances[0]['00080018'].Value[0];

        // Fetch the rendered image for the first instance
        const url = `http://localhost:80/orthanc/dicom-web/studies/${studyInstanceUID}/series/${seriesInstanceUID}/instances/${instanceUID}/rendered`;
        response = await fetch(url, {
          headers: {
            'Accept': 'image/jpeg',
          }
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        console.log('Image URL:', imageUrl);
        setImageUrl(imageUrl);
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
          {imageUrl && <img src={imageUrl} alt="DICOM Rendered Image" />}
        

        </div>
      );
      
};

export default DicomViewer;
