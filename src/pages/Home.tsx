import React from "react";
import { Link } from "react-router-dom";

import { useAppContext } from "../hooks/useAppContext";
import Header from "../components/Header";

const Home: React.FC = (): JSX.Element => {
  const { count } = useAppContext();

  return (
    <section>
      <Header />
      <h1>Welcome!</h1>
      <p>Current count: {count}</p>
    </section>
  );
};

export default Home;
