import React from "react";
import "./Home.css";
import { BsMouse3 } from "react-icons/bs";
import FeaturedProducts from "./FeaturedProducts";

const Home = () => {
  return (
    <>
      <div className="home bg-red-500 overflow-hidden h-screen w-screen flex justify-center opacity-90 flex-col">
        <h1 className="align-self-center overflow-hidden text-white">
          Browse Our Featured Products
        </h1>
        <a
          href="#featured-products"
          className="align-self-center hover:bg-slate-50 p-2 rounded-lg no-underline text-black border-solid border-black border-2 flex justify-center gap-2"
        >
          Scroll <BsMouse3 className="align-self-middle" />
        </a>
      </div>
      <FeaturedProducts />
    </>
  );
};

export default Home;
