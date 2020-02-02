import { observable, decorate } from 'mobx';
import { createContext } from 'react';

class ViewStore {
    activePage = 'nextDays';
    activeDate = null;
    shiftSetterIsActive = false;
}

decorate(ViewStore, {
    activePage: observable,
    activeDate: observable,
    shiftSetterIsActive: observable
})

export const ViewStoreContext = createContext(new ViewStore());