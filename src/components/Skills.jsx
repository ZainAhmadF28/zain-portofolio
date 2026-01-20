import React from 'react';

const Skills = () => {
  const skillsList = ['React', 'Javascript', 'Node.js', 'Tailwind'];

  return (
    <div className="flex flex-row flex-wrap gap-3 mt-6 justify-center md:justify-start w-full">
      {skillsList.map((skill) => (
        <div
          key={skill}
          className="px-5 py-2 text-sm dark:text-white text-slate-700 transition-all duration-300 ease-in-out border rounded-full cursor-pointer dark:border-white/20 border-slate-300 dark:bg-white/10 bg-white hover:bg-slate-100 dark:hover:bg-white/20 shadow-sm"
        >
          {skill}
        </div>
      ))}
    </div>
  );
};

export default Skills;
