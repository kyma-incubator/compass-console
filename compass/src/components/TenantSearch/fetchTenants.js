export default async function fetchTenants(
  token,
  apiUrl,
  searchTerm = '',
  pageSize,
  endCursor,
) {
  const variables =
    pageSize > 0 && !!endCursor
      ? {
          first: pageSize,
          after: endCursor,
          searchTerm,
        }
      : {
          searchTerm,
          first: 5,
        };
  const query = {
    query: `query tenants($first:Int, $after: PageCursor, $searchTerm: String) {
        tenants(first: $first, after:$after, searchTerm:$searchTerm) {
          data {
            id
            name
          }
          pageInfo {
            startCursor
            hasNextPage
            endCursor
          }
          totalCount
        }
      }`,
    variables,
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(query),
  });
  const json = await response.json();
  return json.data.tenants;
}
