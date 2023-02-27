import React, { useEffect, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { observer } from "mobx-react-lite";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";

import { Loading } from "components/UI";
import { RootStoreContextProvider } from "context/RootStoreContext";
import { AuthorizedRoutes, UnauthorizedRoutes } from "routes";
import { RootStore } from "store/RootStore";
import { trpc } from "utils/trpc";

export const App: React.FC = observer(() => {
  const [rootStore] = useState(() => new RootStore());
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:8000/trpc",
        }),
      ],
    })
  );

  const { isAuth, status } = rootStore.userStore;

  const Routes = isAuth ? AuthorizedRoutes : UnauthorizedRoutes;

  useEffect(() => {
    const controller = new AbortController();
    rootStore.userStore.checkAuth(controller.signal);

    return () => {
      controller.abort();
    };
  }, [rootStore.userStore]);

  return (
    <BrowserRouter>
      <RootStoreContextProvider value={rootStore}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Loading loading={status === "init"} cover>
              <Routes />
            </Loading>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </trpc.Provider>
      </RootStoreContextProvider>
    </BrowserRouter>
  );
});
