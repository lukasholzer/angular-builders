import { StaticPagesBuilderSchema } from '../schema';
import { EOL } from 'os';
import { readFileSync } from 'fs';

/** Extract the route information out of the builder options */
export function getRoutes(options: StaticPagesBuilderSchema): string[] {
  let routes: string[] = options.routes || ['/'];

  if (options.routesFile) {
    routes = routes.concat(
      readFileSync(options.routesFile, 'utf-8')
        .split(EOL)
        .map((route) => route.trim())
        .filter((route) => route?.length),
    );
  }

  return [...new Set(routes)];
}
