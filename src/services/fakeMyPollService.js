const myPolls = [
  {
    _id: "eokdvd3s7nod345m91415",
    ts: 1551997895982,
    title: "Favourite colors",
    description: "Hi guys, I want to know your thoughts on favourite colors.",
    closedate: "01/12/2019",
    entries: [
      {
        _id: "5b21ca3eeb7f6fbccd471815",
        name: "Red",
        votes: 3
      },
      {
        _id: "5b21ca3eeb7f6fbccd471816",
        name: "Blue",
        votes: 1
      },
      {
        _id: "5b21ca3eeb7f6fbccd471817",
        name: "Yellow",
        votes: 5
      },
      {
        _id: "5b21ca3eeb7f6fbccd471818",
        name: "Purple",
        votes: 6
      },
      {
        _id: "5b21ca3eeb7f6fbccd471819",
        name: "Green",
        votes: 3
      }
    ],
    comments: [
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
    ]
  },
  {
    _id: "eokdvd3s7nod345m91417",
    ts: 1551997895982,
    title: "Quality of NBN service",
    description: "How would you rate NBN service from 1 to 10.",
    closedate: "08/07/2019",
    entries: [
      {
        _id: "4b21ca3eeb7f6fbccd471825",
        name: "1",
        votes: 3
      },

      {
        _id: "4b21ca3eeb7f6fbccd471826",
        name: "2",
        votes: 2
      },
      {
        _id: "4b21ca3eeb7f6fbccd471827",
        name: "3",
        votes: 6
      },
      {
        _id: "4b21ca3eeb7f6fbccd471828",
        name: "4",
        votes: 5
      },
      {
        _id: "4b21ca3eeb7f6fbccd471829",
        name: "5",
        votes: 4
      },
      {
        _id: "4b21ca3eeb7f6fbccd471830",
        name: "6",
        votes: 6
      },
      {
        _id: "4b21ca3eeb7f6fbccd471831",
        name: "7",
        votes: 10
      },
      {
        _id: "4b21ca3eeb7f6fbccd471832",
        name: "8",
        votes: 3
      },
      {
        _id: "4b21ca3eeb7f6fbccd471833",
        name: "9",
        votes: 4
      },
      {
        _id: "4b21ca3eeb7f6fbccd471834",
        name: "10",
        votes: 0
      }
    ],
    comments: []
  },
  {
    _id: "eokdvd3s7nod345m91416",
    ts: 1551997895982,
    title: "Time changes to our meeting",
    description:
      "Your suggestion needed for Q1 meeting - tell us when would you like to have our meeting.",
    closedate: "10/18/2020",
    entries: [
      {
        _id: "5b21ca3eeb7f6fbccd471825",
        name: "10:00-12:00 AM tomorrow",
        votes: 25
      },
      {
        _id: "5b21ca3eeb7f6fbccd471826",
        name: "2:30-4:30 PM tomorrow",
        votes: 19
      },
      {
        _id: "5b21ca3eeb7f6fbccd471827",
        name: "6:00-8:00 PM tomorrow",
        votes: 29
      }
    ],
    comments: []
  }
];

export function getMyPolls() {
  return myPolls;
}

export function getMyPoll(pollId) {
  return myPolls.find(m => m._id === pollId);
}

export function saveMyPoll(poll) {
  let pollInDb = getMyPoll(poll) || {};
  pollInDb.title = poll.title;
  pollInDb.description = poll.description;
  pollInDb.entries = poll.entries;

  if (!pollInDb._id) {
    pollInDb._id = Date.now().toString();
    myPolls.push(pollInDb);
  }

  return pollInDb;
}

export function deleteMyPoll(pollId) {
  let pollInDb = getMyPoll(pollId);
  myPolls.slice(myPolls.indexOf(pollInDb), 1);
  return pollInDb;
}
