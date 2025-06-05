import { useQuery } from "@tanstack/react-query";
import { User } from "../shared/schema.js";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error
  };
}
