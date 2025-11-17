import { useUser } from "@/context/usercontext";

export function useUserIdType() {
    const {user} = useUser();
    const userId = user?.attributes?.sub;
    const userType = user?.signInUserSession?.idToken?.payload['cognito:groups']?.[0];
    
    return {userId, userType}
}