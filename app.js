const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
const authDesRoutes = require('./routes/auth-desktopRoutes'); // 🟢 Routes Auth Desktop
const adminRoutes = require('./routes/usermanage'); // 🟢 Routes admin
const commandeRoutes = require('./routes/commandeRoutes');
const clientRoutes = require('./routes/clientRoutes');
const voixRoutes = require('./routes/voixRoute');
const boutiqueRoutes = require('./routes/boutiqueRoutes');
const conventionRoutes = require('./routes/conventionRoutes');

const app = express();
const PORT = process.env.PORT || 3000; 

// 🟢 Middlewares
app.use(cors());
app.use(express.json()); // ✔️ Remplace body-parser.json()
app.use(express.urlencoded({ extended: true })); // ✔️ Remplace body-parser.urlencoded()

// 🟢 Static files
app.use('/uploads', express.static(__dirname + '/uploads'));

// 🟢 Routes
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/course', courseRoutes);
app.use('/conseille', conseilleRoutes);
app.use('/promo', promoRoutes);
app.use('/event', eventRoutes);
app.use('/team', teamRoutes);
app.use('/animateur', animRoutes);
app.use('/animateurvip', animvipRoutes);
app.use('/authdesktop', authDesRoutes); // Authentification desktop
app.use('/catecourse', cateCourseRoutes);
app.use('/cateproduct', cateProductRoutes);
app.use('/order', commandeRoutes);
app.use('/voix', voixRoutes);
app.use('/boutique', boutiqueRoutes);
app.use('/client', clientRoutes);
app.use('/convention', conventionRoutes);
app.use('/user', adminRoutes);

// 🟢 Connexion MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// 🟢 Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
