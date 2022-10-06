import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div>Home</div>
      <Link to="/about">Go to about</Link>
    </>
  );
}

export default Home;
