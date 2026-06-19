const mongoose = require("mongoose");
require("dotenv").config();
const { fetchJSearchJobsBySkills } = require("./src/services/JSearchService");
const AggregatedJob = require("./src/models/AggregatedJob");
const { calculateAdvancedTrustScore } = require("./src/utils/advancedTrustDetector");

const TARGETS = [
    "TCS fresher jobs Pune India", 
    "Infosys jobs Pune India", 
    "Wipro internships Pune India", 
    "Cognizant hiring Pune India",
    "Capgemini fresher Pune India",
    "Tech Mahindra jobs Pune India",
    "Deloitte internships Pune India",
    "IBM software engineer fresher Pune India",
    "Genpact fresher Pune India",
    "HCLTech fresher Pune India",
    "Accenture entry level Pune India"
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");

        let totalSaved = 0;

        for (const query of TARGETS) {
            console.log(`Fetching: ${query}...`);
            const liveJobs = await fetchJSearchJobsBySkills(query);
            console.log(`Found ${liveJobs.length} raw jobs for ${query}.`);
            
            if (liveJobs && liveJobs.length > 0) {
                const bulkOps = liveJobs.map(job => {
                    const trustData = calculateAdvancedTrustScore(job);
                    return {
                        updateOne: {
                            filter: { 
                                title: job.title?.trim(), 
                                company: job.company?.trim(), 
                                applyUrl: job.applyUrl || job.applyLink 
                            },
                            update: {
                                $set: {
                                    uniqueKey: [job.title, job.company, job.applyUrl || job.applyLink].filter(Boolean).join("-").toLowerCase(),
                                    title: job.title?.trim(),
                                    company: job.company?.trim(),
                                    location: job.location?.trim() || "Remote",
                                    description: job.description,
                                    applyUrl: job.applyUrl || job.applyLink,
                                    source: job.source,
                                    type: job.type || "Full-time",
                                    postedAt: job.postedAt || new Date(),
                                    salary: job.salary,
                                    companyLogo: job.companyLogo,
                                    isRemote: job.isRemote,
                                    trustScore: trustData.trust_score,
                                    suspicious: trustData.trust_score < 50,
                                    suspiciousReasons: trustData.scam_flags.length > 0 ? trustData.scam_flags.map(f => f.flag) : undefined
                                }
                            },
                            upsert: true
                        }
                    };
                });
                
                const res = await AggregatedJob.bulkWrite(bulkOps, { ordered: false });
                totalSaved += res.upsertedCount + res.modifiedCount;
            }
            
            // wait a few seconds to avoid rate limiting
            await new Promise(r => setTimeout(r, 2000));
        }

        console.log(`Seeding complete. Upserted ${totalSaved} total roles.`);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
