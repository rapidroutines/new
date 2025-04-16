import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ExerciseProvider } from '@/contexts/exercise-context'
import { ChatbotProvider } from '@/contexts/chatbot-context'
import { SavedExercisesProvider } from '@/contexts/saved-exercises-context'

// Initialize axios with default baseURL
import axios from 'axios'
axios.defaults.baseURL = `${window.location.origin}/api`

// Create a root provider component to wrap all providers
const RootProvider = ({ children }) => (
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ExerciseProvider>
          <ChatbotProvider>
            <SavedExercisesProvider>
              {children}
            </SavedExercisesProvider>
          </ChatbotProvider>
        </ExerciseProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)

createRoot(document.getElementById('root')).render(
  <RootProvider>
    <App />
  </RootProvider>
) 