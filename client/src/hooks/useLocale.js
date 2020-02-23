export const useLocale = () => {
    return localStorage.getItem('i18nextLng') || navigator.language;
}