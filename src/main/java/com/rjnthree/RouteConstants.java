package com.rjnthree;

public class RouteConstants {
    public static final class API {
        public static final String BASE = "/lovegame/";
        public static final String DISPLAY = BASE + "display/" + PATHPARAM.AFTER_DATE;
        public static final String MESSAGE_ENTRY = BASE + "message_entry";
    }

    public static final class PATHPARAM {
        public static final String AFTER_DATE = ":afterdate";
    }
}