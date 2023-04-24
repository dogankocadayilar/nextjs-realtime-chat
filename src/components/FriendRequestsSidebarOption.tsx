"use client";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  sessionId: string;
  intialUnseenRequestCount: number;
}

function FriendRequestsSidebarOption({
  intialUnseenRequestCount,
  sessionId,
}: Props) {
  const [unseenrequestCount, setUnseenRequestCount] = useState<number>(
    intialUnseenRequestCount
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    function friendRequesHandler() {
      setUnseenRequestCount((prev) => prev + 1);
    }

    function addedFriendHandler() {
      setUnseenRequestCount((prev) => prev - 1);
    }

    pusherClient.bind("incoming_friend_requests", friendRequesHandler);
    pusherClient.bind("new_friend", addedFriendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("incoming_friend_requests", friendRequesHandler);
      pusherClient.unbind("new_friend", addedFriendHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
      <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium mg-white">
        <User className="w-4 h-4" />
      </div>
      <p className="truncate">Friend Requests</p>
      {unseenrequestCount > 0 ? (
        <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center bg-indigo-600 text-white ">
          {unseenrequestCount}
        </div>
      ) : null}
    </Link>
  );
}

export default FriendRequestsSidebarOption;
