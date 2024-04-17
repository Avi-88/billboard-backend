import prisma from "./prismaClient.js";

const fetchUserById = async (userId, user_model) => {
  try {
    const user = await user_model.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error) {
    console.log("Failed to fetch userData", error);
    throw { notMain: true, error };
  }
};

const fetchUserByUserName = async (userName) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        userName: userName,
      },
    });

    return user;
  } catch (error) {
    console.log("Failed to fetch userData", error);
    throw { notMain: true, error };
  }
};

const updateUser = async (userId, newDetails, user_model) => {
  try {
    const { userName, email, linkedin, github, bio } = newDetails;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        userName: userName,
        email: email,
        linkedinUrl: linkedin,
        githubUrl: github,
        bio: bio,
      },
    });
    return updatedUser;
  } catch (error) {
    console.log("Failed to update user in db", error);
    throw { notMain: true, error };
  }
};

export { fetchUserById, fetchUserByUserName, updateUser };
