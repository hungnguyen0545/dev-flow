import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "../ui/avatar";

interface UserAvatarProps {
  userId: string;
  name?: string;
  imageURL?: string;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  userId,
  name = "",
  imageURL = "",
  className = "h-9 w-9",
  fallbackClassName = "",
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
          <AvatarFallback
            className={cn(
              "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
              fallbackClassName
            )}
          >
            {initialName}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
