const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const courseRoutes = require('./routes/course');
const conseilleRoutes = require('./routes/conseille');
const cateCourseRoutes = require('./routes/CateCourseROutes');
const animRoutes = require('./routes/animRoutes');
const authRoutes = require('./routes/authRoutes');
const authDesRoutes = require('./routes/auth-desktopRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const voixRoutes = require('./routes/voixRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/course', courseRoutes);
app.use('/conseille', conseilleRoutes);
app.use('/animateur', animRoutes);
app.use('/authdesktop', authDesRoutes);
app.use('/auth', authRoutes);
app.use('/catecourse', cateCourseRoutes);
app.use('/order', commandeRoutes);
app.use('/voix', voixRoutes);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
