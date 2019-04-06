const comments = [
  {
    _id: "5b21ca3eeb7f6fbccd471818",
    ts: 1550207843982,
    user: "Bob",
    content: "Red is awesome.",
    likes: 5,
    for: {
      _id: "5b21ca3eeb7f6fbccd471815",
      name: "Red"
    },
    replies: [
      {
        _id: "5b21ca3eeb7f1fbccd471818",
        ts: 1550207843982,
        user: "Rudy",
        content: "Strongly agreed :)",
        likes: 0
      },
      {
        _id: "5b21ca3eeb7f2fbccd471818",
        ts: 1550207843982,
        user: "Conal",
        content: "Same here.",
        likes: 0
      }
    ]
  },
  {
    _id: "5b21ca3eeb7f6fbccd471814",
    ts: 1551997895982,
    user: "Alice",
    content: "Blue makes me sad.",
    likes: 2,
    for: {
      _id: "5b21ca3eeb7f6fbccd471816",
      name: "Blue"
    }
  },
  {
    _id: "5b21ca3eeb7f6fbccd471811",
    ts: 1552297893982,
    user: "Alice",
    content: "Red is so cool.",
    likes: 1,
    for: {
      _id: "5b21ca3eeb7f6fbccd471815",
      name: "Red"
    }
  },
  {
    _id: "5b21ca3eeb7f6fbccd471820",
    ts: 1453297693982,
    user: "Peter",
    content: "Yellow is my lucky color.",
    likes: 0,
    for: {
      _id: "5b21ca3eeb7f6fbccd471817",
      name: "Yellow"
    }
  }
];

export function getComments() {
  return comments;
}
