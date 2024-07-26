import React from 'react';

interface TaskItemProps {
  content: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ content }) => {
  return <p>{content}</p>
};

export default TaskItem;