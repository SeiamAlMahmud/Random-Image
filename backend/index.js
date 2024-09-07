
const express = require('express');
const { connectDB } = require('./DB/MoongoseDB'); // MongoDB connection function
const Image = require('./models/ImageModel'); // Mongoose Model
const multer = require('multer');
const cors = require('cors');
const path = require('path'); // Required for constructing absolute file paths
const fs = require('fs'); // Required for file system operations
require('dotenv').config();

const app = express();

// Server Port
const PORT = process.env.PORT || 3000;

// MongoDB connection
connectDB();

// Route: Serve images from the "uploads" folder (static route)
app.use('/uploads', express.static('uploads'));

const corsOptions = {
  origin: '*', // Allow all origins. You can specify a certain domain if needed.
  methods: ['GET', 'POST'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type'] // Allow headers that the frontend might send
};

app.use(cors(corsOptions)); // Apply CORS with specific options

app.use(express.json()); // Handle JSON data

// Multer setup: Storage and file name customization
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for file uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Create a unique file name
  }
});

const upload = multer({ storage: storage });

// Image Upload Route
app.post('/uploadmyownimages', upload.single('image'), async (req, res) => {
  try {
    // Save the new image in MongoDB
    const newImage = new Image({
      imageUrl: `/uploads/${req.file.filename}`,
      gender: req.body.gender // Gender data from the frontend
    });

    await newImage.save();
    res.status(201).json({ message: 'Image uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed!' });
  }
});

// Helper function: Get a random image path from MongoDB
async function getRandomImagePath(gender) {
  let filter = {};
  if (gender) {
    filter.gender = gender;
  }

  const images = await Image.find(filter);
  if (images.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * images.length);
  const imageUrl = images[randomIndex].imageUrl;

  // Construct the absolute path to the image file
  const imagePath = path.join(__dirname, 'uploads', imageUrl.split('/uploads/')[1]);
  return imagePath;
}

// Route: Public Images (both boys and girls)
app.get('/public', async (req, res) => {
  const imagePath = await getRandomImagePath(); // Get random image path (not URL)
  if (imagePath) {
    fs.stat(imagePath, (err, stats) => {
      if (err) {
        res.status(404).send('Image not found');
        return;
      }
      res.sendFile(imagePath); // Send file directly from local disk
    });
  } else {
    res.status(404).send('No images found');
  }
});

// Route: Boy images
app.get('/boy', async (req, res) => {
  const imagePath = await getRandomImagePath('boy');
  if (imagePath) {
    fs.stat(imagePath, (err, stats) => {
      if (err) {
        res.status(404).send('Image not found');
        return;
      }
      res.sendFile(imagePath); // Send file directly from local disk
    });
  } else {
    res.status(404).send('No images found');
  }
});

// Route: Girl images
app.get('/girl', async (req, res) => {
  const imagePath = await getRandomImagePath('girl');
  if (imagePath) {
    fs.stat(imagePath, (err, stats) => {
      if (err) {
        res.status(404).send('Image not found');
        return;
      }
      res.sendFile(imagePath); // Send file directly from local disk
    });
  } else {
    res.status(404).send('No images found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





















// const express = require('express');
// const { connectDB } = require('./DB/MoongoseDB'); // MongoDB connection function
// const Image = require('./models/ImageModel'); // Mongoose Model
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path'); // Required for constructing absolute file paths
// require('dotenv').config();

// const app = express();

// // Server Port
// const PORT = process.env.PORT || 3000;

// // MongoDB connection
// connectDB();

// // Route: Serve images from the "uploads" folder (static route)
// app.use('/uploads', express.static('uploads'));

// const corsOptions = {
//   origin: '*', // Allow all origins. You can specify a certain domain if needed.
//   methods: ['GET', 'POST'], // Allow specific HTTP methods
//   allowedHeaders: ['Content-Type'] // Allow headers that the frontend might send
// };

// app.use(cors(corsOptions)); // Apply CORS with specific options

// app.use(express.json()); // Handle JSON data

// // Multer setup: Storage and file name customization
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Destination folder for file uploads
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname); // Create a unique file name
//   }
// });

// const upload = multer({ storage: storage });

// // Image Upload Route
// app.post('/uploadmyownimages', upload.single('image'), async (req, res) => {
//   try {
//     // Save the new image in MongoDB
//     const newImage = new Image({
//       imageUrl: `/uploads/${req.file.filename}`,
//       gender: req.body.gender // Gender data from the frontend
//     });

//     await newImage.save();
//     res.status(201).json({ message: 'Image uploaded successfully!' });
//   } catch (error) {
//     res.status(500).json({ error: 'Image upload failed!' });
//   }
// });

// // Route: Public Images (both boys and girls)
// app.get('/public', async (req, res) => {
//   const imagePath = await getRandomImagePath(); // Get random image path (not URL)
//   if (imagePath) {
//     return res.sendFile(imagePath); // Send file directly from local disk
//   }

//   res.status(404).send('No images found');
// });

// // Route: Boy images
// app.get('/boy', async (req, res) => {
//   const imagePath = await getRandomImagePath('boy');
//   if (imagePath) {
//     return res.sendFile(imagePath); // Send file directly from local disk
//   }

//   res.status(404).send('No images found');
// });

// // Route: Girl images
// app.get('/girl', async (req, res) => {
//   const imagePath = await getRandomImagePath('girl');
//   if (imagePath) {
//     return res.sendFile(imagePath); // Send file directly from local disk
//   }

//   res.status(404).send('No images found');
// });

// // Helper function: Get a random image path from MongoDB
// async function getRandomImagePath(gender) {
//   let filter = {};
//   if (gender) {
//     filter.gender = gender;
//   }

//   const images = await Image.find(filter);
//   if (images.length === 0) {
//     return null;
//   }

//   const randomIndex = Math.floor(Math.random() * images.length);
//   const imageUrl = images[randomIndex].imageUrl;

//   // Construct the absolute path to the image file
//   const imagePath = path.join(__dirname, imageUrl);
//   return imagePath;
// }

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
