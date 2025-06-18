import "dotenv/config";
import { Request, Response } from "express";
import { compressBase64Image } from "../utils/image-compression.js";
import { Posts } from "../schemas/Post.js";

export type User = {
  name: string;
  email: string;
  image: string;
}

export const getPosts = async (req: Request, res: Response) => {
  const { email, userId, limit, page } = req.body;
  const skip = (page - 1) * limit;
  let posts;

  try {
    if (limit) {
      posts = (await Posts.find({ "user.email": email, "user.userId": userId }).skip(skip).limit(limit)).reverse();
    } else {
      posts = (await Posts.find({ "user.email": email, "user.userId": userId }).skip(skip)).reverse();
    }
     // Send response with pagination metadata
    res.json({
        data: posts,
        currentPage: parseInt(page),
        hasMore: posts.length === parseInt(limit), // Check if there are more items
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ message: "Error retrieving posts" }); // Send structured error response
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const { id, limit, skip } = req.body;

  try {
    const post = await Posts.findOne({ _id: id }).lean();

    const comments = post?.comments.slice(skip, skip + limit);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({post, comments, commentsLength: post?.comments.length});
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({ message: "Error retrieving post" });
  }
};


export const addPost = async (req: Request, res: Response) => {
  const { user, postId, prompt, response, responseType, filePreview, tags } =
    req.body;
  try {
    const compressedImage = await compressBase64Image(filePreview, user, prompt)

    const newPost = new Posts({
      user,
      postId,
      prompt,
      response,
      responseType,
      filePreview: compressedImage,
      createdAt: new Date().toISOString(),
      tags,
      likes:[],
      views:[],
      comments:[]
    });
    const result = await newPost.save();
    res.json({ newPost: result });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).send("Error saving post");
  }
};

export const updateLikes = async (req: Request, res: Response) => {
  const { postId, user } = req.body;

  const post = await Posts.find({postId:postId, "likes.email":user.email});
  if(post.length === 0){
    const updatedPost = await Posts.findOneAndUpdate(
      { postId: postId },
      { $push: { likes: user } },
      { new: true } // or `returnDocument: 'after'` if using native MongoDB
    );
    res.json({ likes: updatedPost?.likes });
  }
  else {
    const updatedPost = await Posts.findOneAndUpdate(
      { postId: postId },
      { $pull: { likes: user } },
      { new: true }
    );
  
    res.json({ likes: updatedPost?.likes });
  }
}

export const updateViews = async (req: Request, res: Response) => {
  const { postId, user } = req.body;
  const post = await Posts.find({postId:postId, "views.email":user.email});
  if(post.length === 0){
    const updatedPost = await Posts.findOneAndUpdate(
      { postId: postId },
      { $addToSet: { views: user } },
      { new: true } // or `returnDocument: 'after'` if using native MongoDB
    );
    res.json({ views: updatedPost?.views });
  }
  else {
    res.json({ message: "Already viewed" });
  }
}

export const fetchComments = async (req: Request, res: Response) => {
  const { postId, skip, limit, localComments } = req.body;
  let hasMore
  try {
    const post = await Posts.findOne({ postId: postId });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const localCommentIds = localComments.map((comment:{id:string}) => comment.id);

    const comments = post.comments.slice(skip, limit).filter(comment => !localCommentIds.includes(comment.id))
    console.log(comments)

    if(comments.length !== 0) {
      if(post.comments[post.comments.length - 1].id === comments[comments.length - 1].id){
        hasMore = false
      }
      else{
        hasMore = true
      }
    }

    res.status(200).json({ comments, limit: limit + 20, hasMore });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const addComment = async (req: Request, res: Response) => {
  const { postId, commentId, commentText, user } = req.body;

  try {
    await Posts.updateOne(
      { postId },
      {
        $push: {
          comments: {
            id: commentId,
            text: commentText,
            user,
            createdAt:new Date().toISOString(),
            replies: [] // optional — will default to []
          }
        }
      },
      { new: true }
    );
    const updatedPost = await Posts.findOne({ postId: postId });
    const comment = updatedPost?.comments[updatedPost?.comments.length - 1];

    res.status(200).json({ comment: [comment], commentsLength: updatedPost?.comments.length });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCommentLikes = async (req: Request, res: Response) => {
  const { postId, commentId, user} = req.body;

  try {
    const post = await Posts.findOne({ postId });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find((comment) => comment.id === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likes?.some(
      (likedUser: any) => likedUser.email === user.email
    );

    if (alreadyLiked) {
      comment.likes.pull(user);
    } else {
      // Otherwise, push the user into likes
      comment.likes.push(user);
    }

    await post.save();

    return res.status(200).json({ comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReplyLikes = async (req: Request, res: Response) => {
  const { postId, commentId, replyId, user } = req.body;

  try {
    const post = await Posts.findOne({ postId });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find((comment) => comment.id === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.find((reply) => reply.id === replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const alreadyLiked = reply.likes?.some(
      (likedUser:User) => likedUser.email === user.email
    );

    if (alreadyLiked) {
      reply.likes.pull(user);
    } else {
      // Otherwise, push the user into likes
      reply.likes.push(user);
    }

    await post.save();

    return res.status(200).json({ comments: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addReply = async (req: Request, res: Response) => {
  const { postId, commentId, replyId, replyText, user } = req.body;

  try {
    const updatedPost = await Posts.findOneAndUpdate(
      {
        postId,
        "comments.id": commentId
      },
      {
        $push: {
          "comments.$.replies": {
            id: replyId,
            text: replyText,
            user,
            createdAt:new Date().toISOString()
          }
        }
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post or comment not found" });
    }

    res.status(200).json({ comments: updatedPost.comments });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Server error" });
  }
};
