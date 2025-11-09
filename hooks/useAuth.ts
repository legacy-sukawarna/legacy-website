import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { User, Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const { setUser, setSession } = useAuthStore();
  const supabase = createClient();
  const router = useRouter();

  const fetchUserByUUID = async () => {
    const user: User = JSON.parse(localStorage.getItem("user") || "{}");
    const session: Session = JSON.parse(
      localStorage.getItem("session") || "{}"
    );

    if (!user?.id || !session?.access_token) {
      router.push("/login");
      return;
    }

    try {
      // Use /users/me endpoint which gets user from JWT token
      // This works even for first-time login
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error: any) {
      console.error("Error fetching user:", error);

      // Only redirect to login on authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/login");
      }
      throw error;
    }
  };

  const setupAuthListeners = () => {
    const authListener = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          setSession(null);
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  };

  const initializeAuth = async () => {
    const session = await supabase.auth.getSession();
    const user = await supabase.auth.getUser();

    setSession(session.data.session);
    localStorage.setItem("user", JSON.stringify(user.data.user));
    localStorage.setItem("session", JSON.stringify(session.data.session));

    await fetchUserByUUID();
  };

  return {
    fetchUserByUUID,
    setupAuthListeners,
    initializeAuth,
  };
};
