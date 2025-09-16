const express = require('express')
const { protect, authorize } = require('../../middlewares/auth')
const router = express.Router()

const { createBrand } = require('../../controllers/brands/brandsController');
const { uploadBrandMiddleware } = require('../../middlewares/uploadMiddleware');

router.post('/saveBrand', authorize, protect, uploadBrandMiddleware, createBrand)