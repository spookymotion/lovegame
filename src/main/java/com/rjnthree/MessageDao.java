package com.rjnthree;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterConstructorMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

public interface MessageDao {
    @SqlUpdate("INSERT INTO message(author, message_contents) VALUES (:author,:message_contents)")
    void insertMessage(@Bind("author") String author, @Bind("message_contents") String content);

    @SqlQuery("SELECT * FROM message where date > FROM_UNIXTIME(:after_date)")
    @RegisterConstructorMapper(Message.class)
    List<Message> listMessage(@Bind("after_date") long afterDate);

    @SqlUpdate("DELETE FROM message where id = :id")
    void deleteMessage(@Bind("id") long id);
}
