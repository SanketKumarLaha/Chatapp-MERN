import { PawPrint } from "lucide-react";
import React from "react";

const AppName = () => {
  return (
    <>
      <h1 className="font-sans text-3xl font-semibold text-third-color tracking-wider">
        CatComms
      </h1>
      <div className="text-third-color ml-2">
        <PawPrint />
      </div>
    </>
  );
};

export default AppName;
