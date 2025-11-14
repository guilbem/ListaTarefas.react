import { useState, type FormEvent, type ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import "./Auth.css"; 

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage(" Conta criada! Verifique seu e-mail.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        setMessage(" Login efetuado com Sucesso!");
      }
    } catch (err: any) {
      setMessage(" x " + (err.message ?? "Erro ao autenticar."));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignUp ? "Criar Conta" : "Entrar"}</h2>

        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            {isSignUp ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <p>
          {isSignUp ? "Já possui conta?" : "Não possui conta?"}{" "}
          <span
            className="auth-link"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Entrar" : "Criar Conta"}
          </span>
        </p>
      </div>
    </div>
  );
};
