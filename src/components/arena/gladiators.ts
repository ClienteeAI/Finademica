import victorHaleImg from "@/assets/gladiator-victor-hale.jpg";

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
];
