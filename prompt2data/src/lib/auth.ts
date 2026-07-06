import { signInWithPopup, getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";

export interface UserInfo {
  uid: string;
  name: string;
  email: string;
  picture?: string;
  provider?: 'google' | 'github';
  credits?: number;
  plan?: string;
  lastLogin?: string;
}
export function saveUserInfo(userInfo: UserInfo) {
  if (typeof window !== "undefined") {
    localStorage.setItem("p2d_user_info", JSON.stringify(userInfo));
  }
}

export function getUserInfo(): UserInfo | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("p2d_user_info");
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function getFreshToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await getIdToken(user, true);
  } catch (error) {
    console.error("Failed to get fresh token:", error);
    return null;
  }
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getFreshToken();
  
  if (!token) {
    logout();
    throw new Error("No authenticated user");
  }
  
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  if (res.status === 401) {
    const freshToken = await getFreshToken();
    if (freshToken) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Authorization": `Bearer ${freshToken}`,
          "Content-Type": "application/json",
        },
      });
    }
  }
  
  return res;
}

export function isAuthenticated(): boolean {
  return !!auth.currentUser;
}

export function onAuthChange(callback: (user: UserInfo | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userInfo = getUserInfo();
      callback(userInfo);
    } else {
      callback(null);
    }
  });
}

export async function verifyAuth(): Promise<boolean> {
  const token = await getFreshToken();
  if (!token) return false;

  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    return res.ok;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return false;
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await getIdToken(user, true);

    const res = await fetch("/api/auth/provider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

   if (!res.ok) {
  const err = await res.text();
  console.log("BACKEND ERROR:", err);
  throw new Error("Failed to authenticate with server");
}

    const data = await res.json();
    
    const userInfo: UserInfo = {
      uid: data.user.uid,
      name: data.user.name,
      email: data.user.email,
      picture: data.user.image,
      provider: 'google',
      credits: data.user.credits,
      plan: data.user.plan,
      lastLogin: data.user.lastLogin,
    };

    saveUserInfo(userInfo);
    
    return userInfo;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}

export async function loginWithGithub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    const token = await getIdToken(user, true);

    const res = await fetch("/api/auth/provider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      throw new Error("Failed to authenticate with server");
    }

    const data = await res.json();
    
    const userInfo: UserInfo = {
      uid: data.user.uid,
      name: data.user.name || user.displayName || user.email?.split('@')[0] || 'User',
      email: data.user.email || user.email || '',
      picture: data.user.image || user.photoURL || undefined,
      provider: 'github',
      credits: data.user.credits,
      plan: data.user.plan,
      lastLogin: data.user.lastLogin,
    };

    saveUserInfo(userInfo);
    
    return userInfo;
  } catch (error) {
    console.error("GitHub login error:", error);
    throw error;
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("p2d_user_info");
    auth.signOut();
    window.location.href = "/login";
  }
}