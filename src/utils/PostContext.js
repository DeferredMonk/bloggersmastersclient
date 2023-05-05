import { createContext, useEffect, useState } from "react";
import { getAllPosts, getAllPostsOfUser } from "./Services/PostService";
import keycloak from "../keycloak";
import { CreateNewUser, getUserByIdOrUsername } from "./Services/UserService";
import { useMediaQuery } from "@mui/material";

const PostsContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState();
  const [currUser, setCurrUser] = useState();
  const [currUserPosts, setCurrUserPosts] = useState();
  const minWidth = useMediaQuery('(min-width:1000px)')
  /**
   * Creates or gets a new user, depending on existance of user in database
   * @param {Object} user the object of the new user
   */
  const setUser = async (user) => {
    try {
      const newUser = await CreateNewUser(user);
      setCurrUser(newUser);
      setCurrUserPosts(await getAllPostsOfUser(newUser.id));
    } catch (e) {
      try {
        const oldUser = await getUserByIdOrUsername(user.username);
        setCurrUser(oldUser);
        setCurrUserPosts(await getAllPostsOfUser(oldUser.id));
      } catch (e) {
        console.log(e.message);
      }
    }
  };
  /**
   * Adds and filters the modified post
   *  and updates the posts state
   */
  const modifyPost = async (post) => {
    const postToModify = await post;
    if (postToModify.publicPost) {
      const newPosts = [
        ...posts.filter((p) => p.id !== postToModify.id),
        postToModify,
      ];
      newPosts.sort((a, b) => a.id - b.id);
      setPosts(newPosts);
    }
    if (!postToModify.publicPost) {
      const newPosts = [...posts.filter((p) => p.id !== postToModify.id)];
      newPosts.sort((a, b) => a.id - b.id);
      setPosts(newPosts);
    }
    if (currUser.username === post.user.username) {
      console.log(currUserPosts, currUserPosts === undefined);
      const newUserPosts =
        currUserPosts !== undefined
          ? [
              ...currUserPosts.filter((p) => p.id !== postToModify.id),
              postToModify,
            ]
          : [postToModify];
      newUserPosts.sort((a, b) => a.id - b.id);
      setCurrUserPosts(newUserPosts);
    }
  };
  /**
   * Fetches the logged user
   */
  useEffect(() => {
    if (keycloak.authenticated) {
      const { given_name, family_name, preferred_username } =
        keycloak.tokenParsed !== undefined && keycloak.tokenParsed;
      setUser({
        firstName: given_name,
        lastName: family_name,
        username: preferred_username,
      });
    }
  }, [keycloak.authenticated]);

  /**
   * Gets Posts from the database on page startup
   */
  useEffect(() => {
    const allPosts = async () => {
      const postss = await getAllPosts();
      setPosts(postss);
    };
    allPosts();
  }, []);
  return (
    <PostsContext.Provider
      value={{ posts, modifyPost, currUser, currUserPosts, minWidth }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
