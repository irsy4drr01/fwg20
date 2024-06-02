import { Router } from "express";
import { createNewUser, getUsers, getDetailUser, updateUserHandler, deleteUserHandler, registerNewUser, loginUser } from "../handlers/users";
import { authorization } from "../middlewares/authorization";

const usersRouter = Router();

usersRouter.get("/", getUsers);
//usersRouter.get("/:email", authorization, getDetailUser);
usersRouter.get("/:uuid", authorization, getDetailUser);
usersRouter.post("/", createNewUser);
usersRouter.patch("/:email", updateUserHandler);
usersRouter.delete("/:email", deleteUserHandler);

// register user
usersRouter.post("/new", registerNewUser);

// login akun user
usersRouter.post("/account", loginUser);

export default usersRouter;



