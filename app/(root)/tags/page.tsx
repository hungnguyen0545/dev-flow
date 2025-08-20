import { TagCard } from "@/components/cards/TagCard";
import DataRenderer from "@/components/renderers/DataRenderers";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tag.action";

const TagsPage = async ({ searchParams }: RouteParams) => {
  const { page = 1, pageSize = 10, query, filter } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page),
    pageSize: Number(pageSize),
    query,
    filter,
  });

  const { tags } = data!;

  console.log("tags:", tags);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          iconSrc="/icons/search.svg"
          placeholder="Search Tags ..."
          otherClasses="flex-1"
        />
      </section>
      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default TagsPage;
