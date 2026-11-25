export const requestPasswordReset = async (email: string): Promise<void> => {
  // TODO: Replace with your actual API endpoint
  // const response = await fetch('https://your-api.com/auth/forgot-password', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email }),
  // });
  // if (!response.ok) throw new Error('Network response was not ok');

  // Mock implementation for demonstration
  console.log(`Requesting password reset for: ${email}`);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};