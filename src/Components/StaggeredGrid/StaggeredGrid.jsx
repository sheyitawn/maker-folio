// ./Components/StaggeredGrid/StaggeredGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { transition } from 'three/examples/jsm/tsl/display/TransitionNode.js';

const containerVariants = {
  hidden: {
     opacity: 0,
     transition: {
        delay: 1
     }
    },
  visible: {
    opacity: 1,
    transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StaggeredGrid = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child) =>
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StaggeredGrid;
