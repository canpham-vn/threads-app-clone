import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error: " + error.message);
  }
};

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "Postedby and text fields are required" });
    }

    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();
    res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error: " + error.message);
  }
};

export { createPost, getPost };
