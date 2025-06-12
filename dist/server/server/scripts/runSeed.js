process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // temporary fix for SSL error
import { seedStandardizedSubjects } from '../standardizedSubjects.js';
seedStandardizedSubjects()
    .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
})
    .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
