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
        debug: false,
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
                    "invalidCredentials": "The user name or password is incorrect, or the account is currently locked.",
                    "login": "Log in",
                    "pleaseWait": "Please wait...",
                    "username": "User name",
                    "password": "Password",
                    "logOut": "Log out",
                    "error": "Error",
                    "setShifts": "Set shifts",
                    "close": "Close",
                    "cancel": "Cancel",
                    "viewingUser": "{{name}}'s schedule",
                    "youCannotSetShiftsForOthers": "You cannot set shifts for others. Select yourself from the dropdown if you want to set your shifts.",
                    "oldPassword": "Old password",
                    "newPassword": "New password",
                    "newPasswordConfirm": "Confirm new password",
                    "changePassword": "Change password",
                    "invalidPasswordCombo": "Invalid password combination. Please try again.",
                    "passwordTooShort": "Password must be at least 8 characters long.",
                    "passwordTooWeak": "Password must contain at least 3 of the following: lowercase letter, uppercase letter, number, special character.",
                    "passwordChangeSuccess": "Your password was changed successfully.",
                    "offline": "Offline",
                    "getDbState": "Get current DB state",
                    "dbState": "Database state",
                    "state": "State",
                    "upload": "Upload",
                    "invalidJson": "Invalid JSON",
                    "mySchedule": "My schedule",
                    "otherUsers": "Other users",
                    "buildDate": "Build date: {{buildDate}}",
                    "security": "Security",
                    "rooms": "Rooms",
                    "back": "Back",
                    "dbStateSetter": "DB State"
                }
            },
            bg: {
                translation: {
                    "invalidUsername": "Моля, въведете потребителско име съдържащо само букви и цифри!",
                    "invalidPassword": "Моля, въведете парола!",
                    "invalidCredentials": "Потребителското име или паролата са невалидни, или акаунтът е заключен.",
                    "login": "Вход",
                    "pleaseWait": "Моля, изчакайте...",
                    "username": "Потребителско име",
                    "password": "Парола",
                    "logOut": "Изход",
                    "error": "Грешка",
                    "setShifts": "Задай смени",
                    "close": "Затвори",
                    "cancel": "Отмени",
                    "viewingUser": "График на {{name}}",
                    "youCannotSetShiftsForOthers": "Не можете да задавате смени на други потребители. Изберете себе си от падащото меню, ако искате да зададете вашите смени.",
                    "oldPassword": "Стара парола",
                    "newPassword": "Нова парола",
                    "newPasswordConfirm": "Потвърдете новата парола",
                    "changePassword": "Смяна на паролата",
                    "invalidPasswordCombo": "Невалидна комбинация от пароли. Моля, опитайте отново.",
                    "passwordTooShort": "Паролата трябва да бъде поне 8 символа дълга.",
                    "passwordTooWeak": "Паролата трябва да съдържа поне 3 от следните: малка буква, главна буква, цифра, специален символ.",
                    "passwordChangeSuccess": "Паролата ви бе променена успешно.",
                    "offline": "Няма връзка",
                    "getDbState": "Зареди текущото състояние",
                    "dbState": "Състояние на базата",
                    "state": "Състояние",
                    "upload": "Качи",
                    "invalidJson": "Невалиден JSON",
                    "mySchedule": "Моят график",
                    "otherUsers": "Други потребители",
                    "buildDate": "Дата на компилация: {{buildDate}}",
                    "security": "Сигурност",
                    "rooms": "Стаи",
                    "back": "Обратно",
                    "dbStateSetter": "Състояние на базата данни"
                }
            }
        }
    })

export default i18n