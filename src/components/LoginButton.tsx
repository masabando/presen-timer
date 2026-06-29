import { signInWithPopup, signOut } from "firebase/auth";

export default function LoginButton({
  user,
  loading,
  auth,
  provider,
}: {
  user: any;
  loading: boolean;
  auth: any;
  provider: any;
}) {
  return (
    <div className="fixed top-0 right-0 m-4">
      {loading ? (
        <span className="loading loading-ring loading-sm"></span>
      ) : user ? (
        <button
          className="btn btn-ghost font-normal text-primary"
          onClick={() => {
            signOut(auth);
          }}
        >
          Logout
        </button>
      ) : (
        <button
          className="btn btn-ghost font-normal text-gray-700"
          onClick={() => {
            signInWithPopup(auth, provider);
          }}
        >
          Login
        </button>
      )}
    </div>
  );
}
