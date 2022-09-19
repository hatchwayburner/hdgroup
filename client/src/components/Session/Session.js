//retrieve/change authentication token and email in session storage

export function setSessionToken(token) {
    sessionStorage.setItem('token', JSON.stringify(token));
}
export function getSessionToken() {
    const sessionToken = sessionStorage.getItem('token');
    const token = JSON.parse(sessionToken);
    return token
}

export function setSessionEmail(email) {
    sessionStorage.setItem('email', JSON.stringify(email));
}
export function getSessionEmail() {
    const sessionEmail = sessionStorage.getItem('email');
    const email = JSON.parse(sessionEmail);
    return email
}