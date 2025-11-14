import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./Components/Auth";
import TaskManager from "./Components/TaskManager";
import { supabase } from "./supabase-client";
import type { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // buscar sessoo atual
    const fetchSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession ?? null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="App">
      {session ? (
        <>
          <div style={{ textAlign: "right", padding: 12 }}>
            <span style={{ marginRight: 8 }}>{session.user?.email}</span>
            <button onClick={logout}> Log Out</button>
          </div>
          <TaskManager session={session} />
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
