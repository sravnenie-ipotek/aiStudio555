// TEST FILE - Created to test git push behavior
// This file has intentional formatting issues to see if they get auto-fixed

export function testFunction() {
  const message = 'Hello World'; // Missing space around =
  console.log(message); // Will be flagged by eslint
  return message; // Missing semicolon
}

// Long line that exceeds 120 characters limit ------------------------------------------------------------------------------------- extra long line here

const obj = { name: 'test', value: 123 }; // Missing spaces

// This comment is to test if the pre-commit hooks will modify this file
// Created at: ${new Date().toISOString()}
