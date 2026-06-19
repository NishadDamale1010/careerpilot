const calculateSkillMatch = (resumeSkills = [], jobRequirements = []) => {
    let totalScore = 0;
    const jobSkillCount = jobRequirements.length;
    if (jobSkillCount === 0) return 100; // No specific skills required

    const proficiencyMap = { 'expert': 1.0, 'intermediate': 0.7, 'beginner': 0.4 };
    const matchedSkills = [];
    const missingSkills = [];

    jobRequirements.forEach(requiredSkill => {
        const userSkill = resumeSkills.find(
            s => s.skill.toLowerCase() === requiredSkill.skill.toLowerCase()
        );

        if (userSkill) {
            const userProf = proficiencyMap[userSkill.proficiency_level] || 0.5;
            const requiredProf = proficiencyMap[requiredSkill.level] || 0.5;
            let skillScore = (userProf / requiredProf) * 100;
            if (skillScore > 100) skillScore = 100;

            let importanceWeight = requiredSkill.importance === 'must_have' ? 1.0 : 0.6;
            totalScore += skillScore * importanceWeight;
            matchedSkills.push(requiredSkill.skill);
        } else {
            missingSkills.push(requiredSkill.skill);
        }
    });

    return {
        score: (totalScore / jobSkillCount) || 0,
        matched: matchedSkills,
        missing: missingSkills
    };
};

const calculateExperienceMatch = (userYears, requiredYears) => {
    if (!requiredYears) return 100;
    const uY = Number(userYears) || 0;
    const rY = Number(requiredYears) || 0;

    if (uY >= rY) return 100;
    if (uY >= rY * 0.8) return 80;
    if (uY >= rY * 0.5) return 60;
    return 40;
};

const calculateEducationMatch = (userDegree, requiredDegree) => {
    if (!requiredDegree) return 100;
    const degreeMap = { 'phd': 3, 'masters': 2, 'bachelors': 1, 'diploma': 0.5, 'high_school': 0 };
    
    const uD = degreeMap[userDegree?.toLowerCase()] || 0;
    const rD = degreeMap[requiredDegree?.toLowerCase()] || 1;

    if (uD >= rD) return 100;
    if (uD >= rD * 0.8) return 70;
    return 40;
};

const calculateJobMatch = (parsedResume, parsedJob, userLocationPref, jobLocation, jobCompany = "") => {
    if (!parsedResume || !parsedJob) return null;

    const skillData = calculateSkillMatch(parsedResume.skills, parsedJob.required_skills);
    const expScore = calculateExperienceMatch(parsedResume.total_years_experience, parsedJob.experience_required?.years);
    const eduScore = calculateEducationMatch(parsedResume.education?.[0]?.degree, parsedJob.education_required);
    
    // Simplistic location match
    let locScore = 50;
    if (!jobLocation || jobLocation.toLowerCase().includes("remote")) {
        locScore = 100;
    } else if (userLocationPref && jobLocation.toLowerCase().includes(userLocationPref.toLowerCase())) {
        locScore = 100;
    }

    // Salary match (assuming 100 if no explicit preference set for now)
    const salScore = 100;

    // Weights: 40% Skills, 25% Experience, 15% Education, 10% Location, 10% Salary
    let overall_match = (skillData.score * 0.40) + (expScore * 0.25) + (eduScore * 0.15) + (locScore * 0.10) + (salScore * 0.10);

    // ── Priority Company Boost ──
    const SERVICE_COMPANIES = [
        "tata consultancy services", "tcs", "infosys", "wipro", "hcl", "hcltech", 
        "tech mahindra", "cognizant", "capgemini", "accenture", "ltimindtree", 
        "persistent systems", "oracle", "ibm", "deloitte", "pwc", "ey", "kpmg", 
        "ntt data", "mphasis", "hexaware", "birlasoft", "coforge", "virtusa",
        "cyient", "kpit", "zensar", "sonata software", "nagarro", "globallogic",
        "quest global", "l&t technology services", "larsen & toubro infotech", "amdocs",
        "genpact", "wns", "concentrix", "teleperformance", "sutherland", "foundever",
        "exl", "firstsource", "hgs", "ttec", "brillio", "publicis sapient", 
        "epam", "thoughtworks", "rackspace", "fujitsu", "dxc", "cgi"
    ];
    
    if (jobCompany) {
        const companyLower = jobCompany.toLowerCase();
        const isPriority = SERVICE_COMPANIES.some(c => companyLower.includes(c));
        if (isPriority) {
            overall_match += 15; // 15 point artificial boost
            if (overall_match > 100) overall_match = 100;
        }
    }

    return {
        overall_match: Math.round(overall_match),
        skill_match: Math.round(skillData.score),
        experience_match: Math.round(expScore),
        education_match: Math.round(eduScore),
        location_match: Math.round(locScore),
        salary_match: Math.round(salScore),
        matched_skills: skillData.matched,
        missing_skills: skillData.missing
    };
};

module.exports = { calculateJobMatch };
