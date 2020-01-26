import { observable, decorate } from 'mobx';
import { createContext } from 'react';

class ViewStore {
    activePage = 'nextDays';
    activeDate = null;
}

decorate(ViewStore, {
    activePage: observable,
    activeDate: observable
})

export const ViewStoreContext = createContext(new ViewStore());