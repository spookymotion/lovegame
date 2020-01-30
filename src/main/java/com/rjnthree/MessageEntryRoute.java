package com.rjnthree;

import java.sql.Connection;

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
        return null;
    }
}
