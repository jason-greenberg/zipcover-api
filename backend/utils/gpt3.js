// import environmental variables
require('dotenv').config({ path: '../.env'});
const axios = require('axios');

const requestCoverLetterFromGPT3 = async (resume = 'hi', jobDescription = 'be able to say hi') => {
  // Parameters for GPT-3 API
  const model = 'text-ada-001'
  const prompt = 
    `You will act as an expert cover letter writer for junior web developers. I will give you a resume and job description to 
    craft a very compelling cover letter for. Write a junior web developer cover letter based on the following resume and job description.
    Highlight projects in the resume to explain qualifications. Include keywords from the job description in the cover letter if possible,
    but do it without copying entire sections verbatim. Resume: ${resume} | Job Description: ${jobDescription}`;
  
  const max_tokens = 500; // (property only used for text-davinci-003 model)
  const temperature = 0.7 // Scale of 0 to 1, indicating less or more risk respectively
  console.log('This is the api, ', process.env.GPT_API_KEY );

  const response = await axios.post('https://api.openai.com/v1/completions', {
    model,
    prompt,
    max_tokens, // (property only used for text-davinci-003 model)
    temperature
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.GPT_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  console.log(response.data);
  return response.data;
}


module.exports = { requestCoverLetterFromGPT3 }
