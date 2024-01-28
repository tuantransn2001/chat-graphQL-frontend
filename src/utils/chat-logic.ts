import { Message } from "../gql/graphql";

type MessageGroupByDate = {
  [key: string]: Message[];
};

export function handleGroupMessagesByDate(
  messages: Message[]
): MessageGroupByDate {
  return messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as MessageGroupByDate);
}
