// Disclaimer: This example keeps the access token in LocalStorage just because
// it's simpler, but in a real application you may want to use cookies instead
// for better security. Also, it doesn't handle token expiration.
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:9000";

//key name for local storage so we can rtrieve the token, key = accessToken
const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

//runs on submitting login form
export async function login(email, password) {
  //makes request to server/login
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    return null;
  }
  const { token } = await response.json();
  //if success saves JWT to local storage and retrieves ID and email
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  return getUserFromToken(token);
}

// retrieves user id and email from token
function getUserFromToken(token) {
  const claims = jwtDecode(token);
  return {
    id: claims.sub,
    email: claims.email,
  };
}

export function getUser() {
  //retrieve token from local storage
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  //if success retrieve user id and email from token
  return getUserFromToken(token);
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
