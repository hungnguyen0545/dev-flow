import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  return (
    <div>
      <h1>Question Details: {id}</h1>
      <Link href={ROUTES.QUESTIONS_EDIT(id)}>
        <Button>Edit</Button>
      </Link>
    </div>
  );
};

export default QuestionDetails;
