import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DbStateSetter = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dbState, setDbState] = useState("");
    const { t } = useTranslation();

    const onCancel = () => {
        if (!isLoading) {
            setIsModalOpen(false);
            setDbState("");
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
            setIsLoading(true);

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
                setIsLoading(false);
                alert(t("error"));
            }
        } catch (err) {
            console.error(err);
            setIsLoading(false);
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
                        {t("setDbState")}
                    </button>
                </div>
            </div>
            <div className={"modal" + (isModalOpen ? " is-active" : "")}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{t("setDbState")}</p>
                        <button
                            className="delete"
                            aria-label="close"
                            type="button"
                            onClick={onCancel}
                        ></button>
                    </header>
                    <section className="modal-card-body">
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
                    <footer className="modal-card-foot">
                        <button
                            className={"button is-black" + (isLoading ? " is-loading" : "")}
                            type="button"
                            onClick={pushDbState}
                        >
                            {t("upload")}
                        </button>
                        <button
                            className="button"
                            type="button"
                            disabled={isLoading}
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