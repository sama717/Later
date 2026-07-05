import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithPassword(email: string, password: string) {
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return false;
    }
    return true;
  }

  async function signUpWithPassword(email: string, password: string, name: string) {
    setIsSubmitting(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    setIsSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return false;
    }
    return true;
  }

  async function signInWithGoogle() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return {
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
    isSubmitting,
    error,
  };
}