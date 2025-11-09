export const getBaseUrl = () => {
  // اگر در محیط Vercel هستیم، از آدرس Vercel استفاده کن
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // در غیر این صورت (محیط توسعه محلی)، از localhost استفاده کن
  return 'http://localhost:3000';
};