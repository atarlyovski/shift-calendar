import { observable, decorate } from 'mobx';
import { createContext } from 'react';

class ViewStore {
    activePage = 'nextDays';
}

decorate(ViewStore, {
    activePage: observable
})

export const ViewStoreContext = createContext(new ViewStore());