// Test file for check-only mode
// This file has intentional formatting issues

export function badlyFormattedFunction(   ) {
const value="test"  // No spaces
console.log(value)  // Missing semicolon
     return value  // Bad indentation
}

const longLine="This is a very long line that exceeds the maximum character limit and should trigger a warning but not be automatically fixed anymore"

// Bad object formatting
const obj={foo:"bar",baz:123}