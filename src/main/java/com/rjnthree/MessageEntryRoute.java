package com.rjnthree;

import java.util.Optional;

import org.jdbi.v3.core.Jdbi;
import spark.Request;
import spark.Response;
import spark.Route;

public class MessageEntryRoute implements Route {
    private final Jdbi jdbi;

    public MessageEntryRoute(Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        String author = Optional.ofNullable(request.params(RouteConstants.PATHPARAM.AUTHOR))
                .orElseThrow(() -> new Exception("You need to provide the parameter: " + RouteConstants.PATHPARAM.AUTHOR));

        String message = Optional.ofNullable(request.params(RouteConstants.PATHPARAM.MESSAGE))
                .orElseThrow(() -> new Exception("You need to provide the parameter: " + RouteConstants.PATHPARAM.MESSAGE));

        jdbi.useExtension(MessageDao.class,
                messageDao -> messageDao.insertMessage(author, message));

        return null;
    }
}
