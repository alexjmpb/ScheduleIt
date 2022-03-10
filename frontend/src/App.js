import './App.css';
import { Provider } from 'react-redux'
import store from './state/store';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>ScheduleIt!</h1>
        <HomePage/>
      </div>
    </Provider>
  );
}

export default App;
