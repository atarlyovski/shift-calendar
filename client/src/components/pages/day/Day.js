import React, { useContext } from 'react';
import CustomDate from '../../../CustomDate';

import { observer } from 'mobx-react-lite';
import { ViewStoreContext } from '../../../mobx/viewStore';

const Day = observer(() => {
    const viewStore = useContext(ViewStoreContext);
    let date = viewStore.activeDate || new CustomDate();

    return (
        <div className="Day">
            <div>{date.format("dddd", navigator.language)}</div>
            <div>{date.format("D MMMM", navigator.language)}</div>
        </div>
    )
});

export default Day;