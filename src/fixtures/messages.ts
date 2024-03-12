import { IMessage } from "react-native-gifted-chat"

// This file contains example messages for the chat screen
export const initialMessages: IMessage[] = [
  {
    _id: 1,
    text: "This is the beginning of your chat with UncannyValleyAI",
    createdAt: new Date(Date.UTC(2024, 2, 11, 17, 20, 0)),
    system: true,
    user: {
      _id: 4,
      name: "System",
      avatar: "https://placekitten.com/140/140",
    },
  },
  {
    _id: 2,
    text: "Hello, I am an artificial intelligence!",
    createdAt: new Date(Date.UTC(2024, 2, 12, 17, 20, 0)),
    user: {
      _id: 2,
      name: "UncannyValleyAI",
      avatar: "https://placekitten.com/140/140",
    },
  },
  {
    _id: 3,
    text: "Hi! Can you help me on my first day at college? I need to find where i'm going to live!",
    createdAt: new Date(Date.UTC(2024, 2, 13, 17, 20, 0)),
    user: {
      _id: 1,
      name: "React Native",
      avatar: "https://placekitten.com/140/140",
    },
    image: "https://placekitten.com/960/540",
  },
  {
    _id: 4,
    text: "This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT",
    createdAt: new Date(Date.UTC(2024, 2, 14, 17, 20, 0)),
    user: {
      _id: 2,
      name: "UncannyValleyAI",
      avatar: "https://placekitten.com/140/140",
    },
    quickReplies: {
      type: "radio", // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: "😋 Yes",
          value: "yes",
        },
        {
          title: "📷 Yes, let me show you with a picture!",
          value: "yes_picture",
        },
        {
          title: "😞 Nope. What?",
          value: "no",
        },
      ],
    },
  },
  {
    _id: 5,
    text: "This is a quick reply. Do you love Gifted Chat? (checkbox)",
    createdAt: new Date(Date.UTC(2024, 2, 15, 17, 20, 0)),
    user: {
      _id: 2,
      name: "UncannyValleyAI",
      avatar: "https://placekitten.com/140/140",
    },
    quickReplies: {
      type: "checkbox", // or 'radio',
      values: [
        {
          title: "Yes",
          value: "yes",
        },
        {
          title: "Yes, let me show you with a picture!",
          value: "yes_picture",
        },
        {
          title: "Nope. What?",
          value: "no",
        },
      ],
    },
  },
  {
    _id: 6,
    text: "Come on!",
    createdAt: new Date(Date.UTC(2024, 2, 15, 18, 20, 0)),
    user: {
      _id: 2,
      name: "UncannyValleyAI",
      avatar: "https://placekitten.com/140/140",
    },
  },
  // {
  //   _id: 7,
  //   text: `Hello this is an example of the ParsedText, links like http://www.google.com or http://www.facebook.com are clickable and phone number 444-555-6666 can call too.
  //       But you can also do more with this package, for example Bob will change style and David too. foo@gmail.com
  //       And the magic number is 42!
  //       #react #react-native`,
  //   createdAt: new Date(Date.UTC(2024, 2, 13, 17, 20, 0)),
  //   user: {
  //     _id: 1,
  //     name: "React Native",
  //     avatar: "https://placekitten.com/140/140",
  //   },
  // },
]
