import { Router } from "express";
import { createNewUser, getUsers, getDetailUser, updateUserHandler, deleteUserHandler, registerNewUser, loginUser } from "../handlers/users";
import { authorization } from "../middlewares/authorization";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:uuid", getDetailUser);
usersRouter.post("/", createNewUser);
usersRouter.patch("/:uuid", updateUserHandler);
usersRouter.delete("/:uuid", deleteUserHandler);

// register user
usersRouter.post("/new", registerNewUser);

// login akun user
usersRouter.post("/account", loginUser);

export default usersRouter;
