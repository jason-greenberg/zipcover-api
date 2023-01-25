const exampleCoverLetter = `Dear Hiring Manager,
I am writing to express my genuine enthusiasm for the [Role] role at [Company]. I am excited about the opportunity to join your team and contribute to the company's mission of advancing scientific research by developing cutting-edge software and technology for scientific instruments. I am particularly impressed by the work [Company] has done in the field of high-resolution imaging and spectroscopy, and I am excited about the opportunity to be a part of such a dynamic and innovative company.
As a student of scientific background, I have transitioned into the field of computer science, and I believe that my background in science has provided me with a unique perspective and understanding of how technology can be applied to advance scientific research. My background in scientific research has given me a deep understanding of the importance of data accuracy and integrity, which is essential in the field of software engineering.
I am particularly proud of the projects I have worked on, such as developing and maintaining an API using Node.js/Express.js/PostgreSQL, creating a secure authentication system with JSON Web Tokens (JWTs), and developing a full-stack web application using JavaScript, HTML, and CSS. These projects have not only given me hands-on experience in software engineering but also provided me with valuable insights into the field. 
I look forward to the opportunity of speaking with you further regarding this position.
Sincerely,
[Your Name]`

const prompt = (resume, jobDescription) => { 
  return `You will act as an expert in generating relatable cover letters for junior web developers. I will give you a resume and a job description to write the cover letter with. The letter should only be two paragraphs. Instuctions for paragraph 1:
  - The tone should be casual, but warm. The tone should not be cliche, idealistic, or overly grandious in scope. Keep it small and modest.
  - The first paragraph should be creative, and personal.
  - Be specific, use articles about the company accomplishing specific things if necessary.
  - The first paragraph should be relatable and specifically about something the company is doing/ has accomplished that I value or personally connect with.
  - Not generic-sounding, it should sound like something that could be said at a networking conference and be meaningful. Should not sound like a template.
  - Look at what the company does and use that to inform this paragraph.
  - Next highlight projects and skills in the resume to explain qualifications in the second paragrah, but avoid making a list with lots of commas. 
  Resume: ${resume} 
  Job Description: ${jobDescription}
  
  Example cover letter:
  ${exampleCoverLetter}

  `
}

module.exports = { prompt }
