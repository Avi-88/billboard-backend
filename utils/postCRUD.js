import prisma from "./prismaClient.js";

const createPost = async (payload) => {
  try {
    const {
      title,
      description,
      userId,
      rating,
      location,
      category,
      size,
      price_per_day,
    } = payload;
    const newPost = await prisma.billboard.create({
      data: {
        title,
        description,
        location,
        category,
        rating,
        size,
        price_per_day,
        owner: {
          connect: { id: userId },
        },
      },
    });

    return newPost;
  } catch (error) {
    console.log("Failed to create post", error);
    throw { notMain: true, error };
  }
};

const fetchALLPosts = async (searchTerm) => {
  try {
    const billboardsQuery = {
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { location: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { category: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    };

    const billboards = await prisma.billboard.findMany(billboardsQuery);

    return billboards;
  } catch (error) {
    console.error("Error fetching billboards:", error);
    throw { notMain: true, error };
  }
};

const fetchUserPosts = async (userId, role) => {
  let userPosts;
  try {
    if (role == "seller") {
      userPosts = await prisma.billboard.findMany({
        where: {
          ownerId: userId,
        },
      });
    } else {
      userPosts = await prisma.billboard.findMany({
        where: {
          renterId: userId,
        },
      });
    }
    return userPosts;
  } catch (error) {
    console.log("Failed to fetch posts for the given user", error);
    throw { notMain: true, error };
  }
};

const postTransaction = async (payload) => {
  const { postId, userId, bill } = payload;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const post = await prisma.billboard.findUnique({
      where: { id: postId },
    });

    if (user.credits < bill) {
      throw new Error("User doesn't have enough credits");
    }

    if (post.renterId !== null) {
      throw new Error("This billboard is already rented");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: user.credits - bill, // Deduct bill from user credits
      },
    });

    const owner = await prisma.seller.findUnique({
      where: { id: post.ownerId },
    });
    const updatedOwner = await prisma.seller.update({
      where: {
        id: post.ownerId,
      },
      data: {
        credits: owner.credits + bill, // Add bill to owner credits
      },
    });

    const updatedPost = await prisma.billboard.update({
      where: {
        id: postId,
      },
      data: {
        rented_by: {
          connect: { id: userId },
        },
      },
    });

    const response = {
      user: updatedUser,
      post: updatedPost,
    };

    return response;
  } catch (error) {
    console.error("Failed to update given post", error);
    throw new Error(error.message); // Throw an instance of Error with descriptive message
  }
};

const updatePost = async (postId, payload) => {
  try {
    const updatedPost = await prisma.billboard.update({
      where: {
        id: postId,
      },
      data: payload,
    });

    return updatedPost;
  } catch (error) {
    console.log("Failed to update given post", error);
    throw { notMain: true, error };
  }
};

const deletePost = async (postId) => {
  try {
    const deletedPost = await prisma.billboard.delete({
      where: {
        id: postId,
      },
    });

    return deletedPost;
  } catch (error) {
    console.log("Failed to delete given post", error);
    throw { notMain: true, error };
  }
};

const fetchPostById = async (postId) => {
  try {
    const postInfo = await prisma.billboard.findUnique({
      where: {
        id: postId,
      },
    });

    return postInfo;
  } catch (error) {
    console.log("Error in fetching the company name", error);
    throw { notMain: true, error };
  }
};


export {
  createPost,
  fetchUserPosts,
  updatePost,
  deletePost,
  postTransaction,
  fetchALLPosts,
  fetchPostById
};
