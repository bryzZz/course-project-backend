import express from "express";
import dotenv from "dotenv";
import * as trpcExpress from "@trpc/server/adapters/express";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import cors from "cors";

dotenv.config();

const app = express();

export const appRouter = router({
  hello: publicProcedure.query(() => "hello"),
  // hi: publicProcedure.
  getUser: publicProcedure.input(z.string()).query((req) => {
    req.input; // string
    return { id: req.input, name: "Bilbo" };
  }),
  // createUser: t.procedure
  //   .input(z.object({ name: z.string().min(5) }))
  //   .mutation(async (req) => {
  //     // use your ORM of choice
  //     return await UserModel.create({
  //       data: req.input,
  //     });
  //   }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Listening: http://localhost:${PORT}`));
