import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "./UploadImage.css";
import { Button, Group } from "@mantine/core";
import axios from "axios";
import { toast } from "react-toastify";

const UploadImage = ({
  propertyDetails,
  setPropertyDetails,
  nextStep,
  prevStep,
}) => {
  const [imageURL, setImageURL] = useState(propertyDetails.image);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleNext = () => {
    setPropertyDetails((prev) => ({ ...prev, image: imageURL }));
    nextStep();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.imageUrl) {
        const fullImageUrl = `http://localhost:8000${response.data.imageUrl}`;
        setImageURL(fullImageUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleChangeImage = () => {
    setImageURL("");
    setSelectedFile(null);
  };

  return (
    <div className="flexColCenter uploadWrapper">
      {!imageURL ? (
        <div>
          <label htmlFor="imageInput">
            <div
              className="flexColCenter uploadZone"
              style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
            >
              <AiOutlineCloudUpload size={50} color="grey" />
              <span>{uploading ? 'Uploading...' : 'Click to Upload Image from PC'}</span>
              <span style={{ fontSize: '0.9rem', color: '#999', marginTop: '0.5rem' }}>
                Supported: JPEG, PNG, GIF, WebP (Max 5MB)
              </span>
            </div>
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="uploadedImage">
          <img src={imageURL} alt="Property" />
          <Button 
            onClick={handleChangeImage} 
            color="red"
            style={{ marginTop: '1rem' }}
            disabled={uploading}
          >
            Change Image
          </Button>
        </div>
      )}

      <Group position="center" mt={"xl"}>
        <Button variant="default" onClick={prevStep} disabled={uploading}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!imageURL || uploading}>
          {uploading ? 'Uploading...' : 'Next'}
        </Button>
      </Group>
    </div>
  );
};

export default UploadImage;
