// import environmental variables
require('dotenv').config({ path: '../.env'});
const axios = require('axios');
const { exampleCoverLetter } = require('./example-cover-letters');

const requestCoverLetterFromGPT3 = async (resume = 'test', jobDescription = 'test') => {
  // Parameters for GPT-3 API
  const model = 'text-ada-001'
  const prompt = 
    `You will act as an expert in generating relatable cover letters for junior web developers. I will give you a resume and a job description to write the cover letter with. The letter should only be two paragraphs. Instuctions for paragraph 1:
    - The tone should be casual, but warm. The tone should not be cliche, idealistic, or overly grandious in scope. Keep it small and modest.
    - The first paragraph should be creative, and personal.
    - Be specific, use articles about the company accomplishing specific things if necessary.
    - The first paragraph should be relatable and specifically about something the company is doing/ has accomplished that I value or personally connect with.
    - Not generic-sounding, it should sound like something that could be said at a networking conference and be meaningful. Should not sound like a template.
    - Look at what the company does and use that to inform this paragraph.
    - Next highlight projects and skills in the resume to explain qualifications in the second paragrah, but avoid making a list with lots of commas. 
    Resume: ${resume} 
    Job Description: ${jobDescription}
    About Company: CompanyInfo
    
    Example cover letter:
    ${exampleCoverLetter}`
  
  const max_tokens = 500; // (property only used for text-davinci-003 model)
  const temperature = 0.7 // Scale of 0 to 1, indicating less or more risk respectively
  // console.log('This is the api, ', process.env.GPT_API_KEY ); // Debugging purposes

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
