"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { formUrlQuery, removeKeyFromUrl } from "@/lib/url";

import { Input } from "../ui/input";

interface LocalSearchProps {
  route: string;
  iconSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  route,
  iconSrc,
  placeholder,
  otherClasses,
}: LocalSearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [searchQuery, setSearchQuery] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (searchQuery) {
        newUrl = formUrlQuery({
          params: searchParams.toString(), // Convert the search params to a string
          key: "query",
          value: searchQuery.trim(),
        });
      } else {
        if (pathname === route) {
          // If the pathname is the same as the route, remove the query parameter
          // It prevents the page from reloading when the user clicks the search button
          newUrl = removeKeyFromUrl({
            params: searchParams.toString(),
            keys: ["query"],
          });
        }
      }
      router.push(newUrl, { scroll: false }); // Navigate to the new URL
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [router, pathname, searchParams, searchQuery, route]);

  return (
    <div
      className={`background-light800_darkgradient min-h-[56px] flex grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      <Image
        src={iconSrc}
        alt="search"
        width={24}
        height={24}
        className="cursor-pointer"
      />

      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="aragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
    </div>
  );
};

export default LocalSearch;
