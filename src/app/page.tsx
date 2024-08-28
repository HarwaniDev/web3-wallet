import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function Home() {
  return (
    <BackgroundBeamsWithCollision>
      <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center dark:text-black text-white font-sans tracking-tight">
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">House Of Wallets</span>
          </div>
      </h2>  
      
    </BackgroundBeamsWithCollision>
    
    
  );
}
