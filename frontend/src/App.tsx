import { useState } from 'react';
import './index.css'
import SignIn from './signin/SignIn';
import Register from './register/Register';
import MainPage from './main/MainPage';

function App() {
  enum AppState {
    SignIn,
    Register,
    MainPage
  }

  const [appState, setAppState] = useState(AppState.SignIn);

  return (
    <>
      {appState == AppState.SignIn &&
        <SignIn onRegister={() => { setAppState(AppState.Register) }} onSuccess={() => { setAppState(AppState.MainPage) }} />
      }
      {appState == AppState.Register &&
        <Register onSignin={() => { setAppState(AppState.SignIn) }} onSuccess={() => { setAppState(AppState.MainPage) }} />
      }
      {appState == AppState.MainPage &&
        <MainPage />
      }
    </>
  )
}

export default App
