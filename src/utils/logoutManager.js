let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

export const triggerLogout = async () => {
  if (logoutHandler) {
    await logoutHandler();
  }
};