import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ExerciseProvider } from '@/contexts/exercise-context'
import { ChatbotProvider } from '@/contexts/chatbot-context'
import { SavedExercisesProvider } from '@/contexts/saved-exercises-context'
import { RapidTreeProvider } from '@/contexts/rapidtree-context'

const RootProvider = ({ children }) => (
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SavedExercisesProvider>
          <ExerciseProvider>
            <ChatbotProvider>
              <RapidTreeProvider>
                {children}
              </RapidTreeProvider>
            </ChatbotProvider>
          </ExerciseProvider>
        </SavedExercisesProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)

createRoot(document.getElementById('root')).render(
  <RootProvider>
    <App />
  </RootProvider>
)
