package ma.ahmedbenidar.tp16.config;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.graphql.execution.ErrorType;
import org.springframework.stereotype.Component;

@Component
public class GestionnaireExceptionsGraphQL extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        ErrorType categorie = (ex instanceof IllegalArgumentException)
                ? ErrorType.BAD_REQUEST
                : ErrorType.INTERNAL_ERROR;

        String libelle = ex.getMessage();
        if (libelle == null || libelle.isBlank()) {
            libelle = ex.getClass().getSimpleName();
        }

        return GraphqlErrorBuilder.newError()
                .message(libelle)
                .errorType(categorie)
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .build();
    }
}
