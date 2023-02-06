const exampleCoverLetter = `Dear Hiring Manager,
I am writing to express my genuine enthusiasm for the [Role] role at [Company]. I am excited about the opportunity to join your team and contribute to the company's mission of advancing scientific research by developing cutting-edge software and technology for scientific instruments. I am particularly impressed by the work [Company] has done in the field of high-resolution imaging and spectroscopy, and I am excited about the opportunity to be a part of such a dynamic and innovative company.
As a student of scientific background, I have transitioned into the field of computer science, and I believe that my background in science has provided me with a unique perspective and understanding of how technology can be applied to advance scientific research. My background in scientific research has given me a deep understanding of the importance of data accuracy and integrity, which is essential in the field of software engineering.
I am particularly proud of the projects I have worked on, such as developing and maintaining an API using Node.js/Express.js/PostgreSQL, creating a secure authentication system with JSON Web Tokens (JWTs), and developing a full-stack web application using JavaScript, HTML, and CSS. These projects have not only given me hands-on experience in software engineering but also provided me with valuable insights into the field. 
I look forward to the opportunity of speaking with you further regarding this position.
Sincerely,
[Your Name]`

const promptOne = (resume, jobDescription) => {
  return `You will act as an expert in generating relatable cover letters for junior web developers. I will give you a resume and a job description to write the cover letter with. Avoid repeating any phrases given in your prompts verbatim. The letter should only be two paragraphs. Do not use the word 'junior'.
  Resume: ${resume}
  Job Description ${jobDescription}
  
  `
}

const promptTwo = (coverLetter, companyDetails) => { 
  return `You will act as an expert in editing cover letters for junior web developers, who wants to include detail about why, on a personal interest level, a candidate is a good fit for a role. 
  Add 1 paragraph to the beginning of this included coverletter to say why the developer is interested in working for the company based on the provided company details.
  Do not plagrize anything below directly, use synonyms and new phrases only, and do not say the word 'junior':
  Coverletter: ${coverLetter}
  Additional company details: ${companyDetails}

  `
}

module.exports = { promptOne, promptTwo }
