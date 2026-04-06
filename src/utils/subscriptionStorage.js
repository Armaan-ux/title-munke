const STORAGE_KEY = 'subscription_signup_data';

export const saveSubscriptionData = (data, stepPath) => {
  const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const newData = {
    ...existingData,
    ...data,
    lastStep: stepPath,
    timestamp: new Date().getTime()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
};

export const getSubscriptionData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearSubscriptionData = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("price")
};

export const hasSavedSubscription = () => {
  const data = getSubscriptionData();
  if (!data) return false;
  
  // Optional: Add expiration logic (e.g., 24 hours)
  const now = new Date().getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  if (now - data.timestamp > ONE_DAY) {
    clearSubscriptionData();
    return false;
  }
  
  return !!data.lastStep;
};
