import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GreetingsModule } from './greetings/greetings.module';
import { interceptors } from './interceptors';
import { applyMiddleware } from 'graphql-middleware';
import { createContext } from './context';
import { logger } from './utils/logger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    {%- if graphql -%}
    GraphQLFederationModule.forRootAsync({
      useFactory: () => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          context: createContext,
          transformSchema: (schema: GraphQLSchema) => {
            return applyMiddleware(schema, ...interceptors);
          },
          formatError: (err) => {
            const errorReport = {
              message: err.message,
              locations: err.locations,
              path: err.path,
              stacktrace: err.extensions?.exception?.stacktrace || [],
              code: err.extensions?.code,
            };
            logger.error('GraphQL Error', errorReport);
            return errorReport;
          },
        };
      },
    }),
    {%- endif -%}
    GreetingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}