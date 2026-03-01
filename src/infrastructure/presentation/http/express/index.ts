import { createControllers } from "@infrastructure/presentation/http/express/composition/controllers";
import { createInfrastructure } from "@infrastructure/presentation/http/express/composition/infrastructure";
import { createAppRouter } from "@infrastructure/presentation/http/express/composition/router";
import { createSessionMiddleware } from "@infrastructure/presentation/http/express/composition/session";
import { createUseCases } from "@infrastructure/presentation/http/express/composition/use-cases";
import { createServer } from "@infrastructure/presentation/http/express/composition/server";

const sessionMiddleware = await createSessionMiddleware();
const infrastructure = createInfrastructure();
const useCases = createUseCases(infrastructure);
const controllers = createControllers(useCases);
const router = createAppRouter(controllers);
const server = createServer(router, sessionMiddleware);

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
