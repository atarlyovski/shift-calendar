import React, { useContext } from 'react';

import observer from 'mobx-react-lite';
import UserStoreContext from '../../../mobx/userStore';

import useShifts from '../../../hooks/useShifts';

const ShiftSetter = observer(({date}) => {
    let shifts = useShifts(date);
    let userStore = useContext(UserStoreContext);

    const allowedShifts = userStore.user.allowedShifts || [];

    return (
        <div className="ShiftSetter">
            {allowedShifts.map(
                allowedShift => 
                    <label
                        for={"set-shift-" + allowedShift}
                        className="pure-checkbox">
                            <input
                                id={"set-shift-" + allowedShift}
                                type="checkbox"
                                checked={shifts.includes(allowedShift)} />
                            {allowedShift}
                    </label>
            )}
        </div>
    )
});