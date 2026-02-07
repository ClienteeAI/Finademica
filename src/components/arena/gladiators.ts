import victorHaleImg from "@/assets/gladiator-victor-hale.jpg";
import marcusStoneImg from "@/assets/gladiator-marcus-stone.jpg";

export interface Gladiator {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  assistantId: string;
  firstMessage: string;
}

export const gladiators: Gladiator[] = [
  {
    id: "victor-hale",
    name: "Victor Hale",
    title: "The Pressure Broker",
    description:
      "A senior market broker who applies cold, calculated pressure. He doesn't shout — he waits. His silence is the loudest thing in the room. Expect time compression, competence doubt, and relentless expectation.",
    imageUrl: victorHaleImg,
    assistantId: "0e9821fc-dd3d-4e2c-9cad-a43a25b933b6",
    firstMessage:
      "My name is Victor Hale. This is a simulated trading scenario. Are you ready?",
  },
  {
    id: "marcus-stone",
    name: "Marcus Stone",
    title: "The Confidence Dissector",
    description:
      "A cold, dismissive market counterpart who has seen thousands of traders fail. He doesn't punch — he cuts. Expect outcome devaluation, skill-vs-luck challenges, and identity destabilization.",
    imageUrl: marcusStoneImg,
    assistantId: "94c3d1e7-b974-40ae-a17b-b322bfee89a4",
    firstMessage:
      "Hi this is Marcus Stone. This is a simulated trading psychology scenario. Assume your last trade was profitable. OK?",
  },
];
