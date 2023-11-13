import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction
} from 'react'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'

import { UserDTO } from '@dtos/UserDTO'

import { auth } from '@services/firebase'
import { useToast } from 'native-base'

export type AuthContextDataProps = {
  user: UserDTO | null
  updateUser: Dispatch<SetStateAction<UserDTO | null>>
  signIn: (email: string, password: string) => Promise<void>
  handleSignUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<UserDTO | undefined>
  handleSignOut: () => Promise<void>
  isLoadingUserStorageData: boolean
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
)

type AuthContextProviderProps = {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(false)

  const toast = useToast()

  const updateUser: AuthContextDataProps['updateUser'] = userData => {
    setUser(userData)
  }

  async function handleSignUp(name: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      await updateProfile(user, { displayName: name })

      setUser({
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL
      })

      if (user && user.uid) {
        toast.show({
          title: 'Usuário criado com sucesso!',
          placement: 'top',
          bgColor: 'green.500'
        })
      }
      return user
    } catch (error) {
      throw error
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      updateUser(user)
      if (user.uid) {
        const title = `Bem vindo de volta ${user.displayName}`

        toast.show({
          title,
          placement: 'top',
          bgColor: 'green.500'
        })
      }
    } catch (error) {
      if (error) {
        let title = 'Usuário/Senha incorreto.'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        })
        setIsLoadingUserStorageData(true)
      }
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function handleSignOut() {
    try {
      await firebaseSignOut(auth)

      updateUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  async function loadUserData() {}

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        updateUser,
        user,
        signIn,
        handleSignUp,
        handleSignOut,
        isLoadingUserStorageData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
