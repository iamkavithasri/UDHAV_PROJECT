import React, { useState } from 'react'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import HomeScreen from './screens/HomeScreen'
import VolunteerScreen from './screens/VolunteerScreen'
import TaskScreen from './screens/TaskScreen'
import AssignScreen from './screens/AssignScreen'
import AssignmentScreen from './screens/AssignmentScreen'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login')
  const [user, setUser] = useState(null)

  const navigate = (screen) => setCurrentScreen(screen)

  const handleLogin = (userData) => {
    setUser(userData)
    navigate('home')
  }

  const handleLogout = () => {
    setUser(null)
    navigate('login')
  }

  const screenProps = { navigate, user, handleLogout }

  const screens = {
    login: <LoginScreen {...screenProps} onLogin={handleLogin} />,
    signup: <SignupScreen {...screenProps} onLogin={handleLogin} />,
    home: <HomeScreen {...screenProps} />,
    volunteers: <VolunteerScreen {...screenProps} />,
    tasks: <TaskScreen {...screenProps} />,
    assign: <AssignScreen {...screenProps} />,
    assignments: <AssignmentScreen {...screenProps} />,
  }

  return (
    <div className="app-root">
      {screens[currentScreen] || screens['login']}
    </div>
  )
}