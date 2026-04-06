import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "./api"

export interface UserInterface {
  id: number;
  username: string;
  is_staff: boolean;
}

interface CredentialsInterface {
  username: string;
  password: string;
}

interface AuthContextInterface {
  user: null | UserInterface;
  isLoading: boolean;
  login: (credentials: CredentialsInterface) => void;
  logout: () => void;
}

interface PropsInterface {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextInterface>({
  user: {id: 0, username: "", is_staff: false},
  isLoading: true,
  login: () => {},
  logout: () => {}
})

export function AuthProvider({children}: PropsInterface) {
  const [user, setUser] = useState<null|UserInterface>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const token = localStorage.getItem("access-token")

    if (token) {
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access-token")
      const decoded = jwtDecode(token)
      const userId = decoded.user_id;

      const response = await api.get(`users/${userId}/`)

      const {id, username, is_staff} = response.data

      setUser({id, username, is_staff})
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: CredentialsInterface) => {
    try {
      const response = await api.post("token/", credentials)

      localStorage.setItem("access-token", response.data.access)
      localStorage.setItem("refresh-token", response.data.refresh)

      await fetchUser()
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{user, isLoading, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
