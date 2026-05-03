import React, { createContext, useEffect, useState } from "react";
import api from "./api"

export interface UserInterface {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  verified: boolean;
}

interface CredentialsInterface {
  username: string;
  password: string;
}

interface CodeResponseInterface {
  clientId: string;
  credential: string;
  select_by: string;
}

interface AuthContextInterface {
  user: null | UserInterface;
  isLoading: boolean;
  login: (credentials: CredentialsInterface) => void;
  googleSignIn: (codeResponse: CodeResponseInterface) => void;
  logout: () => void;
  fetchUser: () => void;
}

interface PropsInterface {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextInterface>({
  user: {id: 0, username: "", email: "", first_name: "", last_name: "", verified: false },
  isLoading: true,
  login: () => {},
  googleSignIn: () => {},
  logout: () => {},
  fetchUser: () => {}
})

export function AuthProvider({children}: PropsInterface) {
  const [user, setUser] = useState<null | UserInterface>(null)
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
      const response = await api.get("users/user/")

      setUser(response.data)
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

  const googleSignIn = async (codeResponse: CodeResponseInterface) => {
    try {
      const response = await api.post("auth/google/", codeResponse)

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
    <AuthContext.Provider value={{user, isLoading, login, googleSignIn, logout, fetchUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
