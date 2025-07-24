import { 
  project1,
  project2,
  project2_1,
  project3,
  project4,
  project5,
} from "../Assets/sketches.js";

import Project1 from '../Portfolio/Project1.jsx';
import Project2 from '../Portfolio/Project2.jsx';
import Project3 from '../Portfolio/Project3.jsx';
import Logs from "../Components/Logs/Logs.jsx";

const projects = [
  {
    title: "GADGET • Flame Punching Fist",
    description: "This is a detailed description of Sketch 1.",
    model: "/test01.glb",
    sketch: project1,
    sub_sketch: project2_1,
    customContent: <Project1 />
  },
  {
    title: "PROP • Adventure Time Voice Box",
    description: "This is a detailed description of Sketch 2.",
    model: "/holo corn.glb",
    sketch: project2,
    sub_sketch: project2_1,
    customContent: <Project2 />
  },
  {
    title: "GADGET • Chaotic Twister",
    description: "This is a detailed description of Sketch 3.",
    model: "/holo corn.glb",
    sketch: project3,
    sub_sketch: project2_1,
    customContent: <Project3 />
  },
  {
    title: "PROP • Magic Glowing Potion",
    description: "This is a detailed description of Sketch 3.",
    model: "/holo corn.glb",
    sketch: project4,
    sub_sketch: project2_1,
    customContent: <Project3 />
  },
  {
    title: "GADGET • Gesture Drone Controller",
    description: "This is a detailed description of Sketch 3.",
    model: "/holo corn.glb",
    sketch: project5,
    sub_sketch: project2_1,
    customContent: <Project3 />
  },
  {
    title: "GADGET • NFC Ring",
    description: "This is a detailed description of Sketch 3.",
    model: "/holo corn.glb",
    sketch: project5,
    sub_sketch: project2_1,
    customContent: <Project3 />
  }
  
];

export default projects;
