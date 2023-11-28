const Header = ({ course }) => {
  return (
    <div>
      <h1>{course.name}</h1>
    </div>
  );
};

const Part = ({ parts }) => {
  return (
    <p>
      {parts.name} {parts.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts?.map((part) => (
        <Part key={part.id} parts={part} />
      ))}
    </>
  );
};

const Total = ({ parts }) => {
  const sumTotal = parts?.reduce((sum, part) => {
    return sum + part.exercises;
  }, 0);
  return <div>total of {sumTotal} exercises</div>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};
export default Course;
