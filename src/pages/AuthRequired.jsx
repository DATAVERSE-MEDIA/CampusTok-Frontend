import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { getAuthNoticeForPath } from "../utils/authNoticeContent";
import {
  storePostLoginAction,
  storePostLoginRedirect,
} from "../utils/postLoginRedirect";
import { isUserSessionAuthenticated } from "../utils/sessionAuth";

export default function AuthRequired() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const canAccessProtectedRoutes = isUserSessionAuthenticated(isAuthenticated);

  const from = location.state?.from || "/";
  const notice =
    location.state?.notice ||
    getAuthNoticeForPath(typeof from === "string" ? from : "/");

  if (canAccessProtectedRoutes) {
    return <Navigate to={typeof from === "string" ? from : "/"} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-lg font-semibold text-white">
            C
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{notice.title}</h1>
          <p className="mt-3 text-base leading-7 text-gray-600">
            {notice.description}
          </p>

          {typeof from === "string" && from !== "/" && (
            <p className="mt-3 text-sm text-gray-500">
              Requested page: <span className="font-medium text-gray-700">{from}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                storePostLoginRedirect(from);
                storePostLoginAction(location.state?.postLoginAction);
                navigate("/login", {
                  state: {
                    from,
                    postLoginAction: location.state?.postLoginAction,
                  },
                });
              }}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => navigate("/general-dashboard")}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
