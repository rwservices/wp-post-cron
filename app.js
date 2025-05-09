const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

// Configuration
const GITHUB_JSON_URL = process.env.GITHUB_JSON_URL;
const WP_API_URL = process.env.WP_API_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;

// Function to fetch JSON data from GitHub
async function fetchGitHubData() {
  try {
    const response = await axios.get(GITHUB_JSON_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub data:', error.message);
    throw error;
  }
}

// Function to insert data into WordPress
async function insertIntoWordPress(data) {
  try {
    for (const item of data) {

      console.log(data);


      const response = await axios.post(WP_API_URL, data, {
        auth: {
          username: WP_USERNAME,
          password: WP_PASSWORD,
        },
      });

      console.log(`Successfully inserted post: ${response.data.id}`);
    }
  } catch (error) {
    console.error('Error inserting into WordPress:', error.message);
    throw error;
  }
}

// Main cron job function
async function runCronJob() {
  console.log('Cron job started at:', new Date().toISOString());
  try {
    const jsonData = await fetchGitHubData();
    await insertIntoWordPress(jsonData);
    console.log('Cron job completed successfully');
  } catch (error) {
    console.error('Cron job failed:', error.message);
  }
}

// Schedule cron job to run every 5 minutes
cron.schedule('*/5 * * * *', () => {
  runCronJob();
});

// Initial run on startup
runCronJob();

console.log('Cron job scheduler started. Running every 5 minutes.');