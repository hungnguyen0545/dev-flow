import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

interface RemoveKeyFromUrlParams {
  params: string;
  keys: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  // Parse the URL to get the current query parameters -> Example: { q: "test" }
  const queryString = qs.parse(params);

  // Update the query parameters with the new key and value -> Example: { q: "test", page: "1" }
  queryString[key] = value;

  // Stringify the URL with the updated query parameters -> Example: "?q=test&page=1"
  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
};

export const removeKeyFromUrl = ({ params, keys }: RemoveKeyFromUrlParams) => {
  // Parse the URL to get the current query parameters -> Example: { q: "test", page: "1" }
  const queryString = qs.parse(params);

  // Remove the keys from the query parameters -> Example: { q: "test", page: "1" }
  keys.forEach((key) => {
    delete queryString[key];
  });

  // Stringify the URL with the updated query parameters -> Example: "?q=test"
  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
};
