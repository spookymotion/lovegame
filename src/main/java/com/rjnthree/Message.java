package com.rjnthree;

import java.sql.Timestamp;

import com.google.gson.annotations.SerializedName;
import org.jdbi.v3.core.mapper.reflect.ColumnName;

public class Message {
    @SerializedName("id")
    private long id;
    @SerializedName("author")
    private String author;
    @SerializedName("message")
    private String message;
    @SerializedName("date")
    private long date;

    public Message(@ColumnName("id") long id,
                   @ColumnName("author") String author,
                   @ColumnName("message_contents") String message,
                   @ColumnName("date") Timestamp date) {
        this.id = id;
        this.author = author;
        this.message = message;
        this.date = date.getTime();
    }

    public long getId() {
        return id;
    }

    public String getAuthor() {
        return author;
    }

    public String getMessage() {
        return message;
    }

    public long getDate() {
        return date;
    }
}
