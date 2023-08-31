const BASE_URL = "http://localhost:3000";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const fetchAPI = async (
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: BodyInit | null | undefined
): Promise<Response> => {
  return fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: DEFAULT_HEADERS,
    body,
  });
};

const post = async (
  path: string,
  body?: BodyInit | null | undefined
): Promise<Response> => {
  return fetchAPI("POST", path, body);
};

const get = async (path: string): Promise<Response> => {
  return fetchAPI("GET", path);
};

export { BASE_URL, post, get };
