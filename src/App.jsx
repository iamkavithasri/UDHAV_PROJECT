import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import VolunteerScreen from "./screens/VolunteerScreen";
import TaskScreen from "./screens/TaskScreen";
import AssignScreen from "./screens/AssignScreen";
import AssignmentScreen from "./screens/AssignmentScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const navigate = (screen) => setCurrentScreen(screen);

  // 🔥 Firebase auth persistence
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          name:
            firebaseUser.displayName ||
            firebaseUser.email.split("@")[0],
        });
        setCurrentScreen("home");
      } else {
        setUser(null);
        setCurrentScreen("login");
      }
      setAuthReady(true);
    });

    return () => unsub();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate("home");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("login");
  };

  const screenProps = { navigate, user, handleLogout };

  if (!authReady) {
    return <div style={{ color: "white", padding: "2rem" }}>Loading…</div>;
  }

  const screens = {
    login: <LoginScreen {...screenProps} onLogin={handleLogin} />,
    signup: <SignupScreen {...screenProps} onLogin={handleLogin} />,
    home: <HomeScreen {...screenProps} />,
    volunteers: <VolunteerScreen {...screenProps} />,
    tasks: <TaskScreen {...screenProps} />,
    assign: <AssignScreen {...screenProps} />,
    assignments: <AssignmentScreen {...screenProps} />,
  };

  return (
    <div className="app-root">
      {screens[currentScreen] || screens["login"]}
    </div>
  );
}