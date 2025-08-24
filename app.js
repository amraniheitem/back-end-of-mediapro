const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const courseRoutes = require('./routes/course');
const conseilleRoutes = require('./routes/conseille');
const promoRoutes = require('./routes/PromoRoutes');
const eventRoutes = require('./routes/EventRoutes');
const teamRoutes = require('./routes/teamRoutes');
const cateCourseRoutes = require('./routes/CateCourseROutes');
const cateProductRoutes = require('./routes/cateProduct');
const animRoutes = require('./routes/animRoutes');
const animvipRoutes = require('./routes/animvipRoutes');
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
app.use('/promo', promoRoutes);
app.use('/event', eventRoutes);
app.use('/team', teamRoutes);
app.use('/animateur', animRoutes);
app.use('/animateurvip', animvipRoutes);
app.use('/authdesktop', authDesRoutes);
app.use('/catecourse', cateCourseRoutes);
app.use('/cateproduct', cateProductRoutes);
app.use('/order', commandeRoutes);
app.use('/voix', voixRoutes);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
