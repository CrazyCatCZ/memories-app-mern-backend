import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

const POSTS_LIMIT = 8;

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const currentPage = Number(page);
    const totalPages = await PostMessage.countDocuments({});
    const numberOfPages = Math.ceil(totalPages / POSTS_LIMIT);

    // Starting index of every page
    const startIndex = (currentPage - 1) * POSTS_LIMIT;

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(POSTS_LIMIT)
      .skip(startIndex);

    res.status(200).json({ posts, currentPage, numberOfPages });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const filteredPosts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.status(200).json(filteredPosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    PostMessage.findById(id)
      .populate("comments.userId", "username")
      .exec((error, result) => {
        res.status(201).json(result);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    userId: req.userId,
    creator: req.username,
  });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const post = req.body;
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id!");

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id!");

  try {
    await PostMessage.findByIdAndRemove(_id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const post = req.body;
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id!");

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { postId, comment } = req.body;

  try {
    PostMessage.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.userId", "username")
      .exec((error, result) => {
        res.status(201).json(result);
      });
  } catch (error) {
    console.log(error.message);
    res.status(409).json({ message: error.message });
  }
};
