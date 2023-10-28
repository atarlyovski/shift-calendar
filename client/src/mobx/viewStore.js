import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';

class ViewStore {
    activePage = 'nextDays';
    activeDate = null;
    shiftSetterIsActive = false;

    constructor() {
        makeAutoObservable(this)
    }
}


export const ViewStoreContext = createContext(new ViewStore());