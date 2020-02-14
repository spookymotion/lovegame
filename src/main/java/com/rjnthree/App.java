package com.rjnthree;

import static com.rjnthree.JsonUtil.json;
import static com.rjnthree.RouteConstants.API;
import static spark.Spark.awaitInitialization;
import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.options;
import static spark.Spark.port;
import static spark.Spark.staticFileLocation;
import static spark.Spark.threadPool;

import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.ResponseTransformer;


public class App 
{
    static Logger LOG = LoggerFactory.getLogger(App.class);
    private static final String[] CORS_HTTP_METHODS = new String[] {"GET", "PUT", "POST", "OPTIONS", "PATCH"};
    private static final String[] CORS_HTTP_HEADERS = new String[] {"Content-Type", "Authorization", "X-Requested-With",
            "Content-Length", "Accept", "Origin", ""};

    public static void main( String[] args )
    {
        try {
            ResponseTransformer transformer = json();

            port(8080);
            threadPool(-1, -1, 30000); // 30 seconds

            staticFileLocation("/public");

            String dbstring = "jdbc:mysql://localhost:3306/lovegame?user=rnordin&password=topsecret&useSSL=false&sessionVariables=innodb_strict_mode=on,transaction_isolation='READ-COMMITTED',sql_mode='TRADITIONAL'";
            LOG.error("Opening Database");
            Jdbi jdbi = Jdbi.create(dbstring);
            jdbi.installPlugin(new SqlObjectPlugin());

            // Internal routes
            get(API.DISPLAY, new DisplayRoute(jdbi), transformer);
            get(API.MESSAGE_ENTRY, new MessageEntryRoute(jdbi), transformer);
            get(API.MESSAGE_DELETE, new MessageDeleteRoute(jdbi), transformer);

            get(API.MESSAGE_REDIRECT, (request, response) -> {
                response.redirect("/message_entry.html");
                return null;
            });

            enableCORS("*", String.join(",", CORS_HTTP_METHODS), String.join(",", CORS_HTTP_HEADERS));

            awaitInitialization();
            LOG.info("server startup complete");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error - " + e);
        }
    }

    private static void enableCORS(final String origin, final String methods, final String headers) {
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
            response.header("Access-Control-Allow-Credentials", "true");
            response.type("application/json");
        });
    }
}
