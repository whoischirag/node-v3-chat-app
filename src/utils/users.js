const users = [];

//add user, remove user , getUser , getUsersInRoom

const addUSer = ({ id, username, room }) => {
  //clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data
  if (!username || !room) {
    return {
      Error: "Username and room are required!",
    };
  }

  //check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //validate username

  if (existingUser) {
    return {
      error: "Username is in Use!",
    };
  }

  //store the USer

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find((user) => {
    if (user.id === id) {
      return user;
    } else {
      return undefined;
    }
  });
  return user;
};

const getAllUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUSer,
  removeUser,
  getUser,
  getAllUsersInRoom,
};
