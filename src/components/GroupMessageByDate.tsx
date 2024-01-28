import { Text } from "@mantine/core";
import { Maybe, Message } from "../gql/graphql";
import { useUserStore, userIdSelector } from "../stores/userStore";
import { handleGroupMessagesByDate } from "../utils/chat-logic";
import MessageBubble from "./MessageBubble";
import moment from "moment";

function GroupMessageByDate({ messages }: { messages: Message[] }) {
  const userId = useUserStore(userIdSelector);

  const messagesByDate = Object.keys(handleGroupMessagesByDate(messages)).map(
    (date: string) => {
      return {
        date: date,
        messages: handleGroupMessagesByDate(messages)[date],
      };
    }
  );

  return messagesByDate.map(({ date, messages }) => {
    const formattedDate = moment(date).format("D MMM YYYY, h:mm");
    const isCurrentDay = moment().isSame(date, "day");
    let lastSenderId: Maybe<number> | undefined = null;
    return (
      <>
        {messages.map((message) => {
          const showAvatar = message.user?.id !== lastSenderId;
          lastSenderId = message.user?.id;
          return (
            <MessageBubble
              key={message?.id}
              message={message}
              showAvatar={showAvatar}
              currentUserId={userId || 0}
            />
          );
        })}
        {!isCurrentDay && (
          <Text py="md" size="sm" ta="center">
            {formattedDate}
          </Text>
        )}
      </>
    );
  });
}

export default GroupMessageByDate;
