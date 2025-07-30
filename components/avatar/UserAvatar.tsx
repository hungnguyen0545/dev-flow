import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";

import { Avatar, AvatarFallback } from "../ui/avatar";

interface UserAvatarProps {
  userId: string;
  name?: string;
  imageURL?: string;
  className?: string;
}

const UserAvatar = ({
  userId,
  name = "",
  imageURL = "",
  className = "h-9 w-9",
}: UserAvatarProps) => {
  // get the first two letters of the name
  const initialName = name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase()
    ?.slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(userId)}>
      <Avatar className={className}>
        {imageURL ? (
          <Image
            src={imageURL}
            width={36}
            height={36}
            quality={100}
            alt={name}
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="primary-gradient font-space-grotesk font-bold tracking-wider text-white">
            {initialName}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
