import { observable, decorate } from 'mobx';
import { createContext } from 'react';

class MiscStore {
    serverHost = "https://localhost:3002";
    // serverHost = "https://192.168.27.130:3002";
}

decorate(MiscStore, {
    serverHost: observable
})

export const MiscStoreContext = createContext(new MiscStore());