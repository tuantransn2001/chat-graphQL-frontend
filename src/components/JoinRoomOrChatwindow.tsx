import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "./Chatwindow";
import { Flex, Text, Image } from "@mantine/core";
import MTSrc from "../assets/mt.jpg";
function JoinRoomOrChatwindow() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = React.useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (!id) {
      setContent(<Image src={MTSrc} />);
    } else {
      setContent(<ChatWindow />);
    }
  }, [setContent, id]);

  return (
    <Flex h="100vh" align={"center"} justify={"center"}>
      <Text ml={!id ? "xl" : "none"} size={!id ? "xl" : ""}>
        {content}
      </Text>
    </Flex>
  );
}

export default JoinRoomOrChatwindow;
