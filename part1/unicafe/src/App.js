import { useState } from 'react';

// a proper place to define a component
const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad;
  if (total === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    );
  }
  const average = (props.good - props.bad) / total;
  const positive = (props.good / total) * 100 + '%';
  return (
    <>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive} />
    </>
  );
};
const StatisticLine = ({ text, value }) => {
  return (
    <div>
      {text} {value}
    </div>
  );
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <button onClick={() => setGood(good + 1)}>Good</button>
        <button onClick={() => setNeutral(neutral + 1)}>Neutral</button>
        <button onClick={() => setBad(bad + 1)}>Bad</button>
        <h1>statistic</h1>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </>
  );
};

export default App;
