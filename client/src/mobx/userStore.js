import { observable, decorate } from 'mobx';
import { createContext } from 'react';

class UserStore {
    user = null;
    userShiftData = null;
}

decorate(UserStore, {
    user: observable,
    userShiftData: observable
})

export const UserStoreContext = createContext(new UserStore());