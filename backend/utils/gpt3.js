// import environmental variables
require('dotenv').config({ path: '../.env'});
const { prompt } = require('./gpt-prompts');
const OpenAI = require('openai');
const { Configuration, OpenAIApi } = OpenAI;
const configuration = new Configuration({
    organization: "org-EbYQ2jkqXMNahTxwyQYd2ktE",
    apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

const requestCoverLetterFromGPT3 = async (resume = 'test', jobDescription = 'test') => {
  const response = await openai.createCompletion({
    model: "text-curie-001",
    prompt: prompt(resume, jobDescription),
    max_tokens: 500,
    temperature: 0.6,
  });
  console.log(response.data)
  return response.data;
}

module.exports = { requestCoverLetterFromGPT3 }
