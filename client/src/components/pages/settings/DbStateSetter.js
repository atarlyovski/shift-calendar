import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DbStateSetter = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPushing, setIsPushing] = useState(false);
    const [dbState, setDbState] = useState("");
    const [isGettingDbState, setIsGettingDbState] = useState(false);
    const { t } = useTranslation();

    const onCancel = () => {
        if (!isPushing) {
            setIsModalOpen(false);
            setDbState("");
        }
    }

    const getDbState = async () => {
        let url = "/api/admin/dbState";
        let response;

        try {
            setIsGettingDbState(true);

            response = await fetch(url, {
                credentials: "include"
            });

            setIsGettingDbState(false);

            if (response.ok) {
                let result = await response.json();
                setDbState(JSON.stringify(result.dbState, null, 2));
            } else {
                console.error(response);
                alert(t("error"));
                return;
            }
        } catch (err) {
            setIsGettingDbState(false);
            console.error(err);
            alert(t("error"));
            return;
        }
    }

    const pushDbState = async () => {
        const url = "/api/admin/setDbState";
        let data;

        try {
            data = {state: JSON.parse(dbState)};
        } catch (err) {
            alert(t("invalidJson"));
            return;
        }

        try {
            setIsPushing(true);

            let response = await fetch(url, {
                credentials: "include",
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.reload();
            } else {
                console.error(response);
                setIsPushing(false);
                alert(t("error"));
            }
        } catch (err) {
            console.error(err);
            setIsPushing(false);
            alert(t("error"));
            return;
        }
    }

    return (
        <div className="DbStateSetter">
            <div className="field">
                <div className="control">
                    <button
                        type="button"
                        className="button is-black"
                        onClick={() => setIsModalOpen(true)}
                    >
                        {t("dbState")}
                    </button>
                </div>
            </div>
            <div className={"modal" + (isModalOpen ? " is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t("dbState")}</p>
                        <button
                            className="delete"
                            aria-label="close"
                            type="button"
                            onClick={onCancel}
                        ></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="field">
                            <div className="control">
                                <button
                                    type="button"
                                    className={"button" + (isGettingDbState ? " is-loading" : "")}
                                    onClick={getDbState}
                                >
                                    {t("getDbState")}
                                </button>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="DbStateSetter-textarea">
                                {t("state")}
                            </label>
                            <textarea
                                id="DbStateSetter-textarea"
                                className="textarea"
                                onChange={e => setDbState(e.target.value)}
                                value={dbState}
                            />
                        </div>
                    </section>
                    <footer className="modal-card-foot buttons">
                        <button
                            className={"button is-black" + (isPushing ? " is-loading" : "")}
                            type="button"
                            onClick={pushDbState}
                        >
                            {t("upload")}
                        </button>
                        <button
                            className="button"
                            type="button"
                            disabled={isPushing}
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    )
};

export default DbStateSetter;