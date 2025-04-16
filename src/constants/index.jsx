import { 
  BookOpen, 
  ChartColumn, 
  Dumbbell, 
  Home, 
  NotepadText, 
  TreePine, 
} 
  from "lucide-react";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/",
      },
    ],
  },
  {
    title: "Hot Features",
    links: [
      {
        label: "ChatBot",
        icon: ChartColumn,
        path: "/chatbot",
      },
      {
        label: "RepBot",
        icon: NotepadText,
        path: "/repbot",
      },
    ],
  },
  {
    title: "Fitness Features",
    links: [
      {
        label: "Library",
        icon: BookOpen,
        path: "/library",
      },
      {
        label: "Exercise Tracker",
        icon: Dumbbell,
        path: "/exercise-tracker",
      },
      {
        label: "RapidTree",
        icon: TreePine,
        path: "/rapidtree",
      },
     
    ],
  },
];
