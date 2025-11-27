import { Provider } from "react-redux";
import store from "./store/store.js";
import Application from "./mainApp.js";

export default function App() {
    return (
        <Provider store={store}>
            <Application />
        </Provider>
    );
}
