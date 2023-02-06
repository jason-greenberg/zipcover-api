# ZipCover
ZipCover is a tool designed to simplify the process of writing and editing cover letters for job applications. Whether you're a junior web developer looking for your first job or an experienced professional seeking a new challenge, ZipCover is the perfect tool for you.

## Live Site
https://zipcover-api.onrender.com

## Features
- Generate cover letters from scratch based on your resume and job descriptions
- Edit existing cover letters to make them more personalized and impactful
- Avoid repeating any phrases given in your prompts verbatim

## How it Works
ZipCover makes use of the advanced language generation capabilities of GPT-3 to generate cover letters that are both relatable and tailored to your specific needs. All you need to do is provide your resume and a job description, and ZipCover will take care of the rest.

If you already have a cover letter that you'd like to improve, ZipCover can help you add an additional paragraph that explains why you're interested in working for a particular company. Simply provide the cover letter and additional details about the company, and ZipCover will generate a personalized and impactful addition to your existing letter.

## Why Use ZipCover
Writing and editing cover letters can be a time-consuming and stressful process, especially if you're not sure what to include or how to make your letter stand out from the crowd. With ZipCover, you can get your cover letters done quickly and easily, giving you more time to focus on other important aspects of your job search.

So if you're ready to take your cover letter game to the next level, give ZipCover a try today!

## Tech Stack
ZipCover has been built using the following technologies:

- Node.js
- Express
- Sequelize
- PostgreSQL

## Prerequisites
Before you can start using ZipCover, you will need to set up the following environment variables using a .env file:

```
DATABASE_URL
JWT_EXPIRES_IN
JWT_SECRET
NODE_ENV (e.g. production or development)
SCHEMA (for database configuration, e.g. 'airbnb_data')
GPT_API_KEY (found under your OpenAI account)
```
## Build
To install and build ZipCover, run the following command in the terminal:

```bash
npm install && npm run build && npm run sequelize --prefix backend db:migrate --debug && npm run sequelize --prefix backend db:seed:all
```
The API is pre-seeded with 3 demo users, coverletters, resumes, and applications for testing purposes, and the build command will migrate the all tables and seed them with the aforementioned data.

## Start
To start the API, run the following command in the terminal:

```bash
npm start
```
## Login and Sign Up
ZipCover features a secure and user-friendly authentication system that leverages JSON Web Tokens (JWT). When a user logs in or signs up, a JWT token will be generated, signed with the secret from the jwtConfig, and added to the cookie. The token contains the user's id and other details, allowing users to seamlessly restore their session data for subsequent requests.

## Prompt Engineering
One of the key features of ZipCover is the ability to fine-tune the output from the GPT-3 API. This is achieved through the use of prompt engineering. ZipCover provides two different prompt functions - promptOne and promptTwo - that are specifically designed to generate cover letters based on a user's resume and job description, as well as to edit an existing cover letter. These prompts allow for greater control over the final output, ensuring that each cover letter is highly relevant and personalized.

--

# API Documentation: Creating a New Cover Letter
## Endpoint: POST /api/resumes/:id/coverletters

Purpose: This endpoint is used to create a new cover letter by providing the resume ID, job description, and company details.

## Prerequisites:

A valid JWT token must be provided in the Authorization header to authenticate the user.
A valid resume ID must be provided in the URL parameter.
Request Body:
```json
{
  "jobDescription": "Software Engineer",
  "companyDetails": "Google Inc."
}
```
- jobDescription: The job description for which the cover letter is being written.
- companyDetails: The details of the company for which the job is being applied for.

The values of both properties of the request can be significantly longer in length than the above exaxmple.

Response:

A JSON object containing the newly created cover letter and application objects will be returned upon successful creation.

Example Request:
```bash
POST /api/resumes/1/coverletters
Authorization: Bearer [JWT Token]
Content-Type: application/json

{
  "jobDescription": "Software Engineer",
  "companyDetails": "Google Inc."
}
```
Example Response:
```bash
HTTP/1.1 200 OK
Content-Type: application/json

{
  "CoverLetter": {
    "id": 1,
    "userId": 1,
    "letterText": "Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer role at Google Inc. With my strong technical background and passion for software development, I am confident in my ability to contribute to your team at Google Inc.\n\nSincerely,\n[Your Name]",
    "engine": "davinci",
    "jobDescription": "Software Engineer",
    "companyDetails": "Google Inc."
  },
  "Application": {
    "id": 1,
    "userId": 1,
    "resumeId": 1,
    "coverLetterId": 1
  }
}
```
Error Responses:

- 404 Not Found: If the provided resume ID does not match any resumes in the database, a 404 Not Found error will be returned.
- 403 Forbidden: If the provided resume does not belong to the authenticated user, a 403 Forbidden error will be returned.

Note: This endpoint leverages the GPT-3 API to generate the cover letter text, and also uses prompt engineering to refine the output.
