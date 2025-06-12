import { useQuery } from "@tanstack/react-query";
export function useAuth() {
    var _a = useQuery({
        queryKey: ["/api/auth/me"],
        retry: false,
    }), user = _a.data, isLoading = _a.isLoading, error = _a.error;
    return {
        user: user,
        isLoading: isLoading,
        isAuthenticated: !!user,
        error: error
    };
}
