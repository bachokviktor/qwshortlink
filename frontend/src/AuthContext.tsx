import React, { createContext, useEffect, useState } from "react";
import api from "./api"

export interface UserInterface {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextInterface {
  user: null | UserInterface;
  isLoading: boolean;
  fetchUser: () => void;
}

interface PropsInterface {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextInterface>({
  user: null,
  isLoading: true,
  fetchUser: () => {}
})

export function AuthProvider({children}: PropsInterface) {
  const [user, setUser] = useState<null | UserInterface>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    setIsLoading(true)

    try {
      const response = await api.get("auth/user/")

      setUser(response.data)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{user, isLoading, fetchUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
