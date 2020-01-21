import { observable, decorate } from 'mobx';
import { createContext } from 'react';

class UserStore {
    user = null;
}

decorate(UserStore, {
    user: observable
})

export const UserStoreContext = createContext(new UserStore());