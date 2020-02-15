package com.rjnthree;

import static com.rjnthree.JsonUtil.json;
import static com.rjnthree.RouteConstants.API;
import static spark.Spark.awaitInitialization;
import static spark.Spark.get;
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

            awaitInitialization();
            LOG.info("server startup complete");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error - " + e);
        }
    }
}
