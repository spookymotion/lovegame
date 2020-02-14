package com.rjnthree;

import java.util.Optional;

import org.jdbi.v3.core.Jdbi;
import spark.Request;
import spark.Response;
import spark.Route;

public class MessageDeleteRoute implements Route {
    private final Jdbi jdbi;

    public MessageDeleteRoute(Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        String idString = Optional.ofNullable(request.params(RouteConstants.PATHPARAM.ID))
                .orElseThrow(() -> new Exception("You need to provide the parameter: " + RouteConstants.PATHPARAM.ID));

        long id = Long.parseLong(idString);
        jdbi.useExtension(MessageDao.class,
                messageDao -> messageDao.deleteMessage(id));

        return null;
    }
}
