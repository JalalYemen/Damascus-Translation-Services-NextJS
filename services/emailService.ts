
// This file provides dummy exports to prevent "Export not found" errors
// if other parts of the application still attempt to import these functions.

export const sendEmail = async (data: any) => {
  console.log("Email service is disabled. Data received:", data);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return { success: true };
};

export const sendQuote = async (data: any) => {
  console.log("Quote service is disabled. Data received:", data);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return { success: true };
};
