export const getTokenFromLocal = () => {
    const token = localStorage.getItem('Token');
    if (!token) return;
    return decodeURI(token.replaceAll("%2D", "-").replaceAll("%2E", "."));
}
