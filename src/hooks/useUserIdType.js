import { useUser } from "@/context/usercontext";

export function useUserIdType() {
    const {user} = useUser();
    console.log("user =>>>>>>>>>>>>>>>>>", user)
    const userId = user?.attributes?.sub;
    const userType = user?.signInUserSession?.idToken?.payload['cognito:groups']?.[0];
    const agentBrokerStatus = user?.brokerStatus
    const brokerId = user?.brokerId
    return {userId, userType, status: user?.status, agentBrokerStatus, brokerId}
}