import axios from 'axios';

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

  const { data } = await axios.post(apiUrl, JSON.stringify(query), {
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return data.data.tenants;
}
