export const getSafeUserData = () => {
    const data = localStorage.getItem('userData');
    if(!data) return null;
    try {
        return JSON.parse(data);
    } catch (error) {
        localStorage.removeItem('userData');
        return null;
    }
}