// To get the authToken
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  export const authToken = getCookie('authToken');
  export const role = getCookie('userRole');
  export const loggedInId = getCookie('userId');
  export const isSubscribed = getCookie('isSubscribed');