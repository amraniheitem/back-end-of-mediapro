const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dh4rojqg7',
  api_key: '821116184565342',
  api_secret: 'gp4b9Oq7o1W6AX7JFZ8d7VLr9Zc',
});

const getCloudinaryStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `MediaPro/${folderName}`, // ex: MediaPro/courses
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
    },
  });
};

module.exports = { cloudinary, getCloudinaryStorage };
