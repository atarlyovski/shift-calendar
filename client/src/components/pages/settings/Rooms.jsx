import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { UserStoreContext } from '../../../mobx/userStore';

import './Rooms.css';

const Rooms = observer(() => {
    const userStore = useContext(UserStoreContext);
    const { t } = useTranslation();
    const [isChangingRoom, setIsChangingRoom] = useState(false);
    const [isTogglingSync, setIsTogglingSync] = useState(false);

    const rooms = (userStore.userShiftData && userStore.userShiftData.rooms) || [];
    const activeRoom = rooms.find(room => room.isActive) || rooms[0] || null;

    const changeActiveRoom = async (roomID) => {
        if (!roomID || !activeRoom || roomID === activeRoom.roomID) {
            return;
        }

        setIsChangingRoom(true);

        try {
            const response = await fetch('/api/user/setActiveRoom', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'roomID=' + encodeURIComponent(roomID)
            });

            if (response.ok) {
                const result = await response.json();
                userStore.userShiftData = result;
            } else {
                console.error(response);
                alert(t('error'));
            }
        } catch (err) {
            console.error(err);
            alert(t('error'));
        } finally {
            setIsChangingRoom(false);
        }
    };

    const toggleRoomSync = async (roomID1, roomID2) => {
        if (!roomID1 || !roomID2 || roomID1 === roomID2) {
            return;
        }

        const roomA = rooms.find(room => room.roomID === roomID1) || null;
        const roomB = rooms.find(room => room.roomID === roomID2) || null;

        if (!roomA || !roomB) {
            return;
        }

        const isSynced = (roomA.syncWithRooms || []).includes(roomID2);

        setIsTogglingSync(true);

        try {
            const response = await fetch('/api/user/setRoomSync', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: [
                    'roomID1=' + encodeURIComponent(roomID1),
                    'roomID2=' + encodeURIComponent(roomID2),
                    'isSynced=' + encodeURIComponent(isSynced ? 0 : 1)
                ].join('&')
            });

            if (response.ok) {
                const result = await response.json();
                userStore.userShiftData = result;
            } else {
                console.error(response);
                alert(t('error'));
            }
        } catch (err) {
            console.error(err);
            alert(t('error'));
        } finally {
            setIsTogglingSync(false);
        }
    };

    if (!rooms.length) {
        return <div>{t('rooms')}</div>;
    }

    return (
        <div className="Rooms">
            <div className="field">
                <label className="label">{t('activeRoom')}</label>
            </div>

            {rooms.map(room => {
                const isActive = room.roomID === activeRoom?.roomID;
                const roomName = room.name || `${t('room')} ${room.roomID}`;

                return (
                    <div className="box mb-3" key={room.roomID}>
                        <div className="is-flex is-justify-content-space-between is-align-items-center">
                            <div>
                                <strong>{roomName}</strong>
                                {isActive ? <span className="tag is-success ml-2">{t('active')}</span> : null}
                            </div>
                            <button
                                type="button"
                                className={"button is-small " + (isActive ? 'is-dark' : 'is-black')}
                                onClick={() => changeActiveRoom(room.roomID)}
                                disabled={isChangingRoom || isActive}
                            >
                                {isActive ? t('activeRoom') : t('switchRoom')}
                            </button>
                        </div>

                        <div className="mt-4">
                            {rooms.filter(otherRoom => otherRoom.roomID !== room.roomID).map(otherRoom => {
                                const synced = (room.syncWithRooms || []).includes(otherRoom.roomID);
                                const otherRoomName = otherRoom.name || `${t('room')} ${otherRoom.roomID}`;

                                return (
                                    <label className="checkbox is-block mb-2" key={`${room.roomID}-${otherRoom.roomID}`}>
                                        <input
                                            type="checkbox"
                                            checked={synced}
                                            onChange={() => toggleRoomSync(room.roomID, otherRoom.roomID)}
                                            disabled={isTogglingSync}
                                        />
                                        <span className="ml-2">{t('syncWithRoom', { roomName: otherRoomName })}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default Rooms;
