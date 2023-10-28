import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';

class UserStore {
    user = null;
    userShiftData = null;

    constructor() {
        makeAutoObservable(this);
    }
}


export const UserStoreContext = createContext(new UserStore());