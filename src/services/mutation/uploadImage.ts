import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export function useUploadImage({ cloudName, uploadPreset, folder }) {
  const mutation = useMutation({
    mutationFn: (formData) => {
      // Append uploadPreset to formData
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);
      // Make the upload request
      return axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
    },
    onSuccess: (data) => {
      console.log('Image uploaded successfully:', data);
      // Handle any success logic here
    },
    onError: (error) => {
      console.error('Error uploading image:', error);
      // Handle any error logic here
    }
  });

  return mutation;
}
