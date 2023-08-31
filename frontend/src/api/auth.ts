import { MaybeUserData } from "bookers-books";
import * as api from "./api";

const register = async (params: MaybeUserData): Promise<void> => {
  return api
    .post("/auth/signup", JSON.stringify(params))
    .then((response) => response.json())
    .then((response) => {
      if (
        response["statusCode"] === 417 &&
        response["message"] === "Username Taken"
      ) {
        throw new Error("Username Taken.");
      }
    });
};

const authStatus = async (): Promise<void> =>
  api.get("/auth/status").then((response) => {
    if (!response.ok) throw new Error("User not found.");
  });

const checkUsername = async (username: string): Promise<void> =>
  api.get(`/auth/check/${username}`).then((response) => {
    if (!response.ok) throw Error("Username Taken.");
  });

const login = async (params: MaybeUserData): Promise<void> =>
  api.post("/auth/login", JSON.stringify(params)).then((response) => {
    if (!response.ok) throw new Error("Username/Password not found.");
  });

const logout = async (): Promise<void> =>
  api.post("/auth/logout").then((response) => {
    if (!response.ok) throw new Error("");
  });

export { register, authStatus, checkUsername, login, logout };
