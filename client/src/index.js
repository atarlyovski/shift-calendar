import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
// import * as serviceWorker from './serviceWorker';
import "./i18n";

// Bulma
// import 'bulma/css/bulma.min.css'; -- dropped in favor of SASS imports of individual files

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
