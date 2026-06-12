require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./src/config/db');
connectDB();

const userRoutes = require('./src/routes/authRoutes');
const getuserRoutes = require('./src/routes/userRoutes');
const jobsRoutes = require('./src/routes/jobRoutes');
const savedJobRoutes = require('./src/routes/savedJobRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/users', getuserRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/saved-jobs',savedJobRoutes); 
app.get('/', (req, res) => {
    res.send('Api is working');
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});