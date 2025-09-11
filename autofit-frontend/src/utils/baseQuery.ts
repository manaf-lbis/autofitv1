import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",

  responseHandler: async (response) => {
    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json")
      ? response.json()
      : response.blob();
  },
});

export const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
  const state = api.getState() as { auth: { user: { role: string } | null } };
  const storedRole = localStorage.getItem('userRole');
  const role = state.auth?.user?.role || storedRole || "user";

  let url = typeof args === "string" ? args : args.url;

  if (url === "auth/me" || url === "auth/logout") {
    url = `auth/${role}/${url.split("/").pop()}`;
  }

  const requestArgs = typeof args === "string" ? url : { ...args, url };
  let result = await baseQuery(requestArgs, api, extraOptions);

  const isLoginRequest =
    typeof args !== "string" &&
    args.method === "POST" &&
    args.url.match(/auth\/[^/]+\/login$/);

  if (result?.error?.status === 401 && !isLoginRequest) {

    const refreshResult = await baseQuery(
      { url: `auth/${role}/refresh`, method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await baseQuery(requestArgs, api, extraOptions);
    } else {
      api.dispatch({ type: 'auth/clearUser' });
      localStorage.clear();
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      return { error: { status: 401, data: "Token refresh failed" } };
    }
  }

  if ('invalidatesTags' in result && result.invalidatesTags === undefined) {
    delete result.invalidatesTags;
  }

  return result;
};
