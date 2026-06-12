require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/authRoutes');
cost =getuserRoutes = require('./src/routes/userRoutes');
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded())

app.use('api/auth',userRoutes);
app.use('api/users',getuserRoutes);

app.get('/',(req,res)=>{
    res.send('Api is working');
});
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
});