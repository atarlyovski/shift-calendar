import React, { useContext } from 'react';
import NextDaysElement from './NextDaysElement';
import OtherUser from './OtherUser';
import { useTranslation } from 'react-i18next';
import './NextDays.css';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../mobx/userStore';
import UserIsHomeStatus from '../../UserIsHomeStatus';

const NextDays = observer(() => {
    const userStore = useContext(UserStoreContext);
    const { t } = useTranslation();

    const dateSpan = {from: -1, to: 4};
    let dates = [];
    let now = new Date();
    let nowFormatted = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    for (let i = dateSpan.from; i < dateSpan.to; i++) {
        let offsetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);

        dates.push(offsetDate);
    }

    let availableUsers = userStore
        .userShiftData
        .rooms
        .find(r => r.isActive)
        .availableUsers || [];

    let otherUsers = availableUsers.filter(user => user.id !== userStore.user.id);

    return (
        <div className="NextDays columns is-multiline">
            <div className="column is-8 is-offset-2">
                <h2 className="NextDays-section-title">
                    <span>{t("mySchedule")}</span>
                    <UserIsHomeStatus isHomeData={userStore.user.isHomeData} />
                </h2>
                <div className="NextDays-days columns is-mobile">
                    {dates.map((date) => <NextDaysElement
                        userID={userStore.user.id}
                        gridWidth={dates.length}
                        key={`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
                        date={date}
                        isToday={`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` === nowFormatted} />)
                    }
                </div>
            </div>
            <div className={"column is-8 is-offset-2" + (otherUsers.length > 0 ? "" : " is-hidden")}>
                <h2 className="NextDays-section-title">{t("otherUsers")}</h2>
                <div className="OtherUsers">
                    {otherUsers.map(
                        user => 
                            <OtherUser
                                userID={user.id}
                                key={user.id}
                                fullName={user.fullName}
                                dates={dates}
                                isHomeData={user.isHomeData}
                                nowFormatted={nowFormatted}
                            />
                    )}
                </div>
            </div>
        </div>
    )
});

export default NextDays;