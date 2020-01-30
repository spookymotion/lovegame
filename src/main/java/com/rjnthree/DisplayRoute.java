package com.rjnthree;

import java.util.Optional;

import com.rjnthree.RouteConstants.PATHPARAM;
import org.jdbi.v3.core.Jdbi;
import spark.Request;
import spark.Response;
import spark.Route;

public class DisplayRoute implements Route {
    private final Jdbi jdbi;

    public DisplayRoute(Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        long afterDate;
        try {
            String afterDateString = Optional.ofNullable(request.params(PATHPARAM.AFTER_DATE))
                    .orElseThrow(() -> new Exception("You need to provide the parameter: " + PATHPARAM.AFTER_DATE));
            afterDate = Long.parseLong(afterDateString);
        } catch (NumberFormatException e) {
            throw new Exception(PATHPARAM.AFTER_DATE + " parameter which is "
                    + request.params(PATHPARAM.AFTER_DATE)
                    + " needs to be a long value");
        }

        return jdbi.withExtension(MessageDao.class,
                messageDao -> messageDao.listMessage(afterDate));
    }
}
