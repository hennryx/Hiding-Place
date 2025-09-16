const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Common file filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Multer memory storage
const memoryStorage = multer.memoryStorage();

// Multer instances
const uploadProduct = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for products
  fileFilter: fileFilter,
});

const uploadProfile = multer({
  storage: memoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for profiles
  fileFilter: fileFilter,
});

const uploadBrand = multer({
  storage: memoryStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB for brands
  fileFilter: fileFilter,
});

// Cloudinary upload middleware with Sharp processing
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    req.image = null; // Allow no image upload
    return next();
  }

  try {
    let folder, publicIdPrefix;
    if (req.file.fieldname === 'image') {
      folder = 'mern_app/products';
      publicIdPrefix = 'product';
    } else if (req.file.fieldname === 'profileImage') {
      folder = 'mern_app/profiles';
      publicIdPrefix = 'profile';
    } else if (req.file.fieldname === 'brandImage') {
      folder = 'mern_app/brands';
      publicIdPrefix = 'brand';
    } else {
      throw new Error('Invalid field name');
    }

    // Generate unique identifier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const publicId = `${publicIdPrefix}-${uniqueSuffix}`;

    // Process image with Sharp: convert to WebP and optimize
    const optimizedImageBuffer = await sharp(req.file.buffer)
      .webp({ quality: 80 }) // Adjust quality (0-100) for balance between size and quality
      .resize({ width: 1200, withoutEnlargement: true }) // Resize to max 1200px width
      .toBuffer();

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: publicId,
          format: 'webp',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(optimizedImageBuffer);
    });

    // Attach image data
    req.image = {
      name: req.file.originalname.replace(/\.([a-zA-Z]+)$/, '.webp'),
      url: result.secure_url,
      cloudinary_id: result.public_id,
    };

    next();
  } catch (error) {
    console.error('Image processing or Cloudinary upload failed:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};

module.exports = {
  uploadProductImage: uploadProduct.single('image'),
  uploadProfileImage: uploadProfile.single('profileImage'),
  uploadBrandImage: uploadBrand.single('brandImage'),
  uploadMiddleware: [uploadProduct.single('image'), uploadToCloudinary], // For products
  uploadProfileMiddleware: [uploadProfile.single('profileImage'), uploadToCloudinary], // For profiles
  uploadBrandMiddleware: [uploadBrand.single('brandImage'), uploadToCloudinary], // For brands
};