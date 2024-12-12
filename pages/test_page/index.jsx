import { useAuth } from "@/contexts/useUserAuth";
import SubscriptionFloat from "@/components/subscription-float";

export default function hadler() {
  const { isLoggedIn, user ,userData} = useAuth();

  return (
    <div>
      Hello {userData ? userData.name: "Guest"}
      <div>Login Status: {isLoggedIn ? "Yes" : "No"}</div>
      <div>Email: {user ? user.email : "Guest"}</div>
      <div>
        2<div>2.1</div>
      </div>
    </div>
  );
}
