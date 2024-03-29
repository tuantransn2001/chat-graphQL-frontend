import React from "react";
import moment from "moment";
import {
  Button,
  Card,
  Text,
  Flex,
  Group,
  Loader,
  ScrollArea,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus, IconX } from "@tabler/icons-react";
import {
  toggleCreateRoomModalSelector,
  useGeneralStore,
} from "../stores/generalStore";
import { useUserStore, userIdSelector } from "../stores/userStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GetChatroomsForUserQuery } from "../gql/graphql";
import { GET_CHATROOMS_FOR_USER } from "../graphql/queries/GetChatroomsForUser";
import { DELETE_CHATROOM } from "../graphql/mutations/DeleteChatroom";
import { useMutation, useQuery } from "@apollo/client";
import OverlappingAvatars from "./OverlappingAvatars";
function RoomList() {
  const toggleCreateRoomModal = useGeneralStore(toggleCreateRoomModalSelector);
  const userId = useUserStore(userIdSelector);

  const { data, loading } = useQuery<GetChatroomsForUserQuery>(
    GET_CHATROOMS_FOR_USER,
    {
      variables: {
        userId: userId,
      },
    }
  );

  const isSmallDevice = useMediaQuery("(max-width: 768px)");
  const defaultTextStyles: React.CSSProperties = {
    textOverflow: isSmallDevice ? "unset" : "ellipsis",
    whiteSpace: isSmallDevice ? "unset" : "nowrap",
    overflow: isSmallDevice ? "unset" : "hidden",
  };

  const defaultFlexStyles: React.CSSProperties = {
    maxWidth: isSmallDevice ? "unset" : "200px",
  };

  const [activeRoomId, setActiveRoomId] = React.useState<number | null>(
    parseInt(useParams<{ id: string }>().id || "0")
  );
  const navigate = useNavigate();

  const [deleteChatroom] = useMutation(DELETE_CHATROOM, {
    variables: {
      chatroomId: activeRoomId,
    },
    refetchQueries: [
      {
        query: GET_CHATROOMS_FOR_USER,
        variables: {
          userId: userId,
        },
      },
    ],
    onCompleted: () => {
      navigate("/");
    },
  });
  const isMediumDevice = useMediaQuery("(max-width: 992px)");
  return (
    <Flex direction={"row"} h={"100vh"} ml={"100px"}>
      <Card shadow="md" p={0}>
        <Flex direction="column" align="start">
          <Group position="apart" w={"100%"} mb={"md"} mt={"md"}>
            <Button
              onClick={toggleCreateRoomModal}
              variant="light"
              leftIcon={<IconPlus />}
            >
              Create a room
            </Button>
          </Group>
          <ScrollArea
            h={"83vh"}
            w={isMediumDevice ? "calc(100vw - 100px)" : "450px"}
          >
            <Flex direction={"column"}>
              <Flex justify="center" align="center" h="100%" mih={"75px"}>
                {loading && (
                  <Flex align="center">
                    <Loader mr={"md"} />
                    <Text c="dimmed" italic>
                      Loading...
                    </Text>
                  </Flex>
                )}
              </Flex>
              {data?.getChatroomsForUser.map((chatroom) => (
                <Link
                  style={{
                    transition: "background-color 0.3s",
                    cursor: "pointer",
                  }}
                  to={`/chatrooms/${chatroom.id}`}
                  key={chatroom.id}
                  onClick={() => setActiveRoomId(parseInt(chatroom.id || "0"))}
                >
                  <Card
                    style={
                      activeRoomId === parseInt(chatroom.id || "0")
                        ? { backgroundColor: "#f0f1f1" }
                        : undefined
                    }
                    py={"lg"}
                    withBorder
                    shadow="md"
                  >
                    <Flex align="center" justify={"space-between"}>
                      <Flex align="center" gap={"sm"}>
                        {chatroom.users && (
                          <Flex align={"center"}>
                            <OverlappingAvatars users={chatroom.users} />
                          </Flex>
                        )}

                        {chatroom.messages && chatroom.messages.length > 0 ? (
                          <Flex
                            style={defaultFlexStyles}
                            direction={"column"}
                            align={"start"}
                            w={"100%"}
                            h="100%"
                          >
                            <Flex direction={"column"}>
                              <Text
                                size="md"
                                fw={600}
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                                style={defaultTextStyles}
                              >
                                {chatroom.name}
                              </Text>
                              <Text style={defaultTextStyles} color="#7D7C7C">
                                {chatroom.messages[0].content}
                              </Text>
                              <Text
                                c="dimmed"
                                size={"xs"}
                                style={defaultTextStyles}
                              >
                                {moment(
                                  chatroom.messages[0].createdAt
                                ).fromNow()}
                              </Text>
                            </Flex>
                          </Flex>
                        ) : (
                          <Flex align="center" justify={"center"}>
                            <Text italic c="dimmed">
                              No Messages
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                      {chatroom?.users && chatroom.users[0].id === userId && (
                        <Flex h="100%" align="end" justify={"end"}>
                          <Button
                            p={0}
                            variant="light"
                            color="red"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteChatroom();
                            }}
                          >
                            <IconX />
                          </Button>
                        </Flex>
                      )}
                    </Flex>
                  </Card>
                </Link>
              ))}
            </Flex>
          </ScrollArea>
        </Flex>
      </Card>
    </Flex>
  );
}

export default RoomList;
