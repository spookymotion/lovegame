package com.rjnthree;

public class RouteConstants {
    public static final class API {
        public static final String BASE = "/lovegame/";
        public static final String DISPLAY = BASE + "display/" + PATHPARAM.AFTER_DATE;
        public static final String MESSAGE_ENTRY = BASE + "message_entry_api/"
                + PATHPARAM.AUTHOR + "/" + PATHPARAM.MESSAGE + "/";
        public static final String MESSAGE_DELETE = BASE + "delete/" + PATHPARAM.ID + "/";

        public static final String MESSAGE_REDIRECT = "/message_entry";
    }

    public static final class PATHPARAM {
        public static final String AFTER_DATE = ":afterdate";
        public static final String AUTHOR = ":author";
        public static final String MESSAGE = ":message";
        public static final String ID = ":id";
    }
}