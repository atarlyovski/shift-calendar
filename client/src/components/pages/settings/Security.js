import React from 'react';

const Security = () => {
    return (
        <div className="Security">
            <div>
                <div className="field">
                    <label htmlFor="change-password-old">{t("oldPassword")}</label>
                    <input 
                        id="change-password-old"
                        className="input"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        name="change-password-old"
                        type="password" />
                </div>
                <div className="field">
                    <label htmlFor="change-password-new">{t("newPassword")}</label>
                    <input 
                        id="change-password-new"
                        className="input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        name="change-password-new"
                        type="password" />
                </div>
                <div className="field">
                    <label htmlFor="change-password-new-confirm">{t("newPasswordConfirm")}</label>
                    <input 
                        id="change-password-new-confirm"
                        className="input"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        name="change-password-new-confirm"
                        type="password" />
                </div>
                <div className={"notification is-danger" + (!isInvalidPasswordCombo ? " is-hidden" : "")}>
                    {t("invalidPasswordCombo")}
                </div>
                <div className="field">
                    <div className="control">
                        <button
                            type="button"
                            onClick={changePassword}
                            className={"button is-black" + (isPasswordLoading ? " is-loading" : "")}
                        >
                            {t("changePassword")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Security;