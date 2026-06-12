require("dotenv").config();

const mongoose = require("mongoose");

const Job = require("./src/models/Job");

const jobs = require("./src/data/jobs");

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {

        await Job.deleteMany();

        await Job.insertMany(jobs);

        console.log("Jobs Inserted");

        process.exit();

    });