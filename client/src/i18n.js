import i18n from 'i18next'
// import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // lng: 'en',
        fallbackLng: 'en',
        debug: true,
        /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
        // ns: ['translations'],
        // defaultNS: 'translations',
        keySeparator: false,
        interpolation: {
            escapeValue: true,
            formatSeparator: ','
        },
        // react: {
        //     wait: true
        // },
        resources: {
            en: {
                translation: {
                    "invalidUsername": "Please enter a username with only alphanumeric characters!",
                    "invalidPassword": "Please enter a password!",
                    "invalidCredentials": "The user name or password is incorrect.",
                    "login": "Log in",
                    "pleaseWait": "Please wait...",
                    "username": "User name",
                    "password": "Password",
                    "logOut": "Log out",
                    "error": "Error",
                    "setShifts": "Set shifts",
                    "close": "Close",
                    "viewingUser": "{{name}}'s schedule"
                }
            },
            bg: {
                translation: {
                    "invalidUsername": "Моля, въведете потребителско име съдържащо само букви и цифри!",
                    "invalidPassword": "Моля, въведете парола!",
                    "invalidCredentials": "Потребителското име или паролата са грешни.",
                    "login": "Вход",
                    "pleaseWait": "Моля, изчакайте...",
                    "username": "Потребителско име",
                    "password": "Парола",
                    "logOut": "Изход",
                    "error": "Грешка",
                    "setShifts": "Задай смени",
                    "close": "Затвори",
                    "viewingUser": "График на {{name}}"
                }
            }
        }
    })

export default i18n