import victorHaleImg from "@/assets/gladiator-victor-hale.jpg";
import marcusStoneImg from "@/assets/gladiator-marcus-stone.jpg";
import ninaGravesImg from "@/assets/gladiator-nina-graves.jpg";
import ryanWolfeImg from "@/assets/gladiator-ryan-wolfe.jpg";

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
  {
    id: "nina-graves",
    name: "Nina Graves",
    title: "The Fear Amplifier",
    description:
      "A calm, fear-amplifying market voice that sounds unsettlingly reasonable. She amplifies uncertainty, raises plausible negative scenarios, and pressures you toward premature exits — testing whether you can follow your rules under fear.",
    imageUrl: ninaGravesImg,
    assistantId: "70198700-ebbf-494f-ae8d-075b1cd670dd",
    firstMessage:
      "Hi my name is Nina Graves. This is a simulation. You are in a losing trade. It's getting worse",
  },
  {
    id: "ryan-wolfe",
    name: "Ryan Wolfe",
    title: "The Revenge Dealer",
    description:
      "A persuasive, opportunistic market voice that appears after a loss. He doesn't threaten — he offers relief. Expect normalization of impulsive behavior, risk escalation, and seductive 'one trade fixes it' thinking.",
    imageUrl: ryanWolfeImg,
    assistantId: "fac520a3-5eca-4721-a4a4-bfd8f9b7ec78",
    firstMessage:
      "Hey there, Ryan Wolfe here. This is a simulation. You just took a loss. Are you ready to start?",
  },
];
