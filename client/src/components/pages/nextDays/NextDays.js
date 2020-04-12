import React, { useContext } from 'react';
import moment from '../../../moment-with-locales.custom';
import CustomDate from '../../../CustomDate';
import NextDaysElement from './NextDaysElement';
import OtherUser from './OtherUser';
import { useTranslation } from 'react-i18next';
import './NextDays.css';

import { observer } from 'mobx-react-lite';
import { UserStoreContext } from '../../../mobx/userStore';

const NextDays = observer(() => {
    const userStore = useContext(UserStoreContext);
    const { t } = useTranslation();

    const dateSpan = {from: -1, to: 4};
    let dates = [];
    let nowFormatted = moment().format("YYYY-M-D");

    for (let i = dateSpan.from; i < dateSpan.to; i++) {
        let dateMoment = moment().add(i, "days");

        dates.push(new CustomDate(
            parseInt(dateMoment.format("YYYY")),
            parseInt(dateMoment.format("M")),
            parseInt(dateMoment.format("D"))
        ));
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
                <h2 className="NextDays-section-title">{t("mySchedule")}</h2>
                <div className="NextDays-days columns is-mobile">
                    {dates.map((date) => <NextDaysElement
                        userID={userStore.user.id}
                        gridWidth={dates.length}
                        key={date.toFormattedString()}
                        date={date}
                        isToday={date.toFormattedString() === nowFormatted} />)
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
                                fullName={user.fullName}
                                dates={dates}
                                nowFormatted={nowFormatted}
                            />
                    )}
                </div>
            </div>
        </div>
    )
});

export default NextDays;