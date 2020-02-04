import { observable, decorate } from 'mobx';
import { createContext } from 'react';

class MiscStore {
    // serverHost = "http://localhost:3001";
    serverHost = "http://192.168.27.130:3001";
}

decorate(MiscStore, {
    serverHost: observable
})

export const MiscStoreContext = createContext(new MiscStore());