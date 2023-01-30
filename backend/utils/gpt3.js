// import environmental variables
require('dotenv').config({ path: '../.env'});
const { promptOne, promptTwo } = require('./gpt-prompts');
const OpenAI = require('openai');
const { Configuration, OpenAIApi } = OpenAI;
const configuration = new Configuration({
    organization: "org-EbYQ2jkqXMNahTxwyQYd2ktE",
    apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

const requestCoverLetterFromGPT3 = async (resume = 'test', jobDescription = 'test') => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: promptOne(resume, jobDescription),
    max_tokens: 1000,
    temperature: 0.7,
  });
  console.log(response.data.choices[0].text)
  return response.data;
}

const refineCoverLetterWithGPT3 = async (coverLetter = 'test', companyDetails = '') => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: promptTwo(coverLetter, companyDetails),
    max_tokens: 1000,
    temperature: 0.7,
  });
  console.log(response.data.choices[0].text)
  return response.data;
}

module.exports = { requestCoverLetterFromGPT3, refineCoverLetterWithGPT3 }
