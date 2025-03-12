export const uploadImage = async (file) => {
    try {
      return {
        buffer: file.buffer,
        mimeType: file.mimetype
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  };
  
  export const deleteImage = async () => {
    // No need to implement anything since the image will be deleted
    // automatically when the company record is deleted
    return true;
  };