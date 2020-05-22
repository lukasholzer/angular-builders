import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { from, Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { generateGraphQlServices } from './generate-graphql-services';
import { BuildBuilderSchema } from './schema';

export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext
): Observable<BuilderOutput> {
  return from(generateGraphQlServices(options)).pipe(
    mapTo({ success: true }),
    tap(() => {
      context.logger.info(`\n\n✔︎ Successfully generated graphql services!`);
    }),
    catchError((error) => {
      context.logger.error(error);
      return of({ success: false });
    })
  );
}

export default createBuilder(runBuilder);
