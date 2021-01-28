export const getTokenFromLocal = () => {
    const token = decodeURI(localStorage.getItem('Token').replaceAll("%2D", "-").replaceAll("%2E", "."));
    return token;
}
