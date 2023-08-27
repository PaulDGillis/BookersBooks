import { BASE_URL } from "./consts";

const upload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(BASE_URL + "/book/upload", {
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

const list = async () => {
  return fetch(BASE_URL + "/book/list", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const cover = (bookId: string) => {
  return fetch(BASE_URL + "/book/" + bookId + "/cover", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.blob());
};

export { upload, list, cover };
