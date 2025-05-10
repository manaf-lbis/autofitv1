import React from "react";
import Navbar from "@/features/user/navbar/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to AutoFit</h1>
        <p className="text-lg mb-6">
          Your one-stop solution for automotive services. Explore our offerings and get started today!
        </p>
        <div className="flex items-center gap-4">
          <Link to="/service">
            <Button variant="outline">View Services</Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;