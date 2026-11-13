import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { clearToken, getStoredToken, persistToken } from "../api/client";

type AuthContextType = {
  userLogin: string | null;
  setUserLogin: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string;
  setuserId: React.Dispatch<React.SetStateAction<string>>;
  userInfo: any;
  saveSession: (token: string) => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  setUserLogin: () => {},
  userId: "",
  setuserId: () => {},
  userInfo: null,
  saveSession: () => {},
  logOut: () => {},
});

function readUserId(decoded: any) {
  return decoded?.user || decoded?.userId || decoded?._id || "";
}

function isExpired(decoded: any) {
  if (!decoded?.exp) return false;
  return decoded.exp * 1000 <= Date.now();
}

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userLogin, setUserLogin] = useState<string | null>(() => getStoredToken());
  const [userId, setuserId] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);

  function applyToken(token: string | null) {
    if (!token) {
      setUserLogin(null);
      setuserId("");
      setUserInfo(null);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (isExpired(decoded)) {
        clearToken();
        setUserLogin(null);
        setuserId("");
        setUserInfo(null);
        return;
      }
      setUserLogin(token);
      setUserInfo(decoded);
      setuserId(readUserId(decoded));
    } catch {
      clearToken();
      setUserLogin(null);
      setuserId("");
      setUserInfo(null);
    }
  }

  function saveSession(token: string) {
    persistToken(token);
    applyToken(token);
  }

  function logOut() {
    clearToken();
    applyToken(null);
  }

  useEffect(() => {
    applyToken(getStoredToken());
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userLogin,
        setUserLogin: (value) => {
          setUserLogin(value);
          if (typeof value === "string") persistToken(value);
          if (value === null) clearToken();
        },
        userId,
        setuserId,
        userInfo,
        saveSession,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
