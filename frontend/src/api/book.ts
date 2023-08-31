import * as api from "./api";

// TODO fix this to use backend types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const upload = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(`${api.BASE_URL}/book/upload`, {
    method: "POST",
    credentials: "include",
    headers: {},
    body: formData,
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Couldn't upload book.");
    }
  });
};

const list = async (): Promise<Response> => api.get("/book/list");

const cover = (bookId: string): string =>
  `${api.BASE_URL}/book/${bookId}/cover`;

export { upload, list, cover };
