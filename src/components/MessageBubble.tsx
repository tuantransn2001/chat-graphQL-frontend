import React from "react";
import { Message } from "../gql/graphql";
import { Avatar, Flex, Image, Paper, useMantineTheme } from "@mantine/core";

interface MessageProps {
  message: Message;
  currentUserId: number;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageProps> = ({
  message,
  currentUserId,
  showAvatar,
}) => {
  const theme = useMantineTheme();

  if (!message?.user?.id) return null;
  const isSentByCurrentUser = message.user.id === currentUserId;

  return (
    <Flex
      justify={isSentByCurrentUser ? "flex-end" : "flex-start"}
      align={"center"}
      m={"md"}
      mb={10}
    >
      {!isSentByCurrentUser && showAvatar && (
        <Avatar
          radius={"xl"}
          src={message.user.avatarUrl || null}
          alt={message.user.fullname}
        />
      )}
      <Flex direction={"column"} justify={"center"} align={"center"}>
        {!isSentByCurrentUser && <span>{message.user.fullname}</span>}
        <Paper
          px="md"
          py="xs"
          style={{
            marginLeft: isSentByCurrentUser ? 0 : 10,
            marginRight: isSentByCurrentUser ? 10 : 0,
            backgroundColor: isSentByCurrentUser
              ? theme.colors.blue[6]
              : "#f1f1f1",
            color: isSentByCurrentUser ? "#fff" : "inherit",
            borderRadius: 10,
          }}
        >
          {message.content}
          {message.imageUrl && (
            <Image
              width={"250"}
              height={"250"}
              fit="cover"
              src={"http://localhost:3000/" + message.imageUrl}
              alt="Uploaded content"
            />
          )}

          {/* <Text
            style={
              isSentByCurrentUser ? { color: "#e0e0e4" } : { color: "gray" }
            }
          >
            {new Date(message.createdAt).toLocaleString()}
          </Text> */}
        </Paper>
      </Flex>
      {isSentByCurrentUser && (
        <Avatar
          mr={"md"}
          radius={"xl"}
          src={message.user.avatarUrl || null}
          alt={message.user.fullname}
        />
      )}
    </Flex>
  );
};

export default MessageBubble;
