import { 
    sketch1, 
    sketch2, 
    sketch3, 
    sketch4, 
    sketch5, 
    sketch6 
} from "../Assets/sketches.js";

import Project1 from '../Portfolio/Project1.jsx';
import Project2 from '../Portfolio/Project2.jsx';
import Project3 from '../Portfolio/Project3.jsx';

const projects = [
  {
    title: "Gadget • Flame Punching Fist",
    description: "This is a detailed description of Sketch 1.",
    model: "/test01.glb",
    sketch: sketch1,
    customContent: <Project1 />
  },
  {
    title: "Prop • Adventure Time Voice Box",
    description: "This is a detailed description of Sketch 2.",
    model: "/holo corn.glb",
    sketch: sketch2,
    customContent: <Project2 />
  },
  {
    title: "Gadget • Chaotic Twister",
    description: "This is a detailed description of Sketch 3.",
    model: "/holo corn.glb",
    sketch: sketch3,
    customContent: <Project3 />
  },
  {
    title: "Prop • Magic Glowing Potion",
    description: "This is a detailed description of Sketch 3.",
    model: "/holo corn.glb",
    sketch: sketch4,
    customContent: <Project3 />
  },
  {
    title: "Gadget • Gesture Drone Controller",
    description: "This is a detailed description of Sketch 3.",
    model: "/holo corn.glb",
    sketch: sketch5,
    customContent: <Project3 />
  },
  {
    title: "Gadget • NFC Ring",
    description: "This is a detailed description of Sketch 3.",
    model: "/holo corn.glb",
    sketch: sketch6,
    customContent: <Project3 />
  }
  
];

export default projects;
