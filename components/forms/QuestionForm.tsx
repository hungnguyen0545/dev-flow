"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ROUTES from "@/constants/routes";
import { createQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validations";

import { TagCard } from "../cards/TagCard";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Define your form.
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { name: string; value: string[] }
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      // validation for the tag
      const tagInput = e.currentTarget.value.trim();
      if (tagInput === "") return;

      if (tagInput.length <= 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          message: "Tag must be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", { message: "Tag already exists" });
      }
    }
  };

  const handleRemoveTag = (
    tag: string,
    field: { name: string; value: string[] }
  ) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", { message: "At least one tag is required" });
    }
  };

  const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
    startTransition(async () => {
      const result = await createQuestion({ params: data });

      if (result.success) {
        toast.success("Question created successfully");
        if (result?.data) {
          router.push(ROUTES.QUESTIONS(result.data._id));
        }
      } else {
        toast.error(result.error?.message || "Something went wrong");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateQuestion)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  value={field.value}
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you&apos;ve put in the
                title.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          name="tags"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleKeyDown(e, field)}
                  />
                  {field?.value?.length > 0 && (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      {field.value.map((tag) => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          isButton
                          remove
                          handleRemove={() => handleRemoveTag(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            disabled={isPending || form.formState.isSubmitting} // disable the button if the question is being submitted
            className="primary-gradient w-fit !text-light-900"
          >
            {isPending ? (
              <>
                <RefreshCw className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <>Ask A Question</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
