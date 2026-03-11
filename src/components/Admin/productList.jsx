import React, { useState } from "react";
import { Button } from "../ui/button";
import ProductTableList from "./ProductTableList";
import ProductFilter from "../common/product-filter";

const ProductList = () => {
  const agentTypes = [
    {
      name: "Organisation",
      id: "Organisation",
    },
    {
      name: " Broker",
      id: "broker",
    },
    {
      name: "Agent",
      id: "agent",
    },
  ];
  const [activeTab, setActiveTab] = useState(agentTypes[0]);

  return (
    <div className="bg-[#F5F0EC] flex items-start justify-start text-secondary">
      <div className="bg-white rounded-xl p-8 w-full">
        <div className="flex flex-col">
        <div className="mb-5 flex items-center justify-between gap-4 border-b pb-5">
          <p className="text-xl font-medium">Profile Details</p>
          <Button variant="secondary" size="lg">
            Create Product
          </Button>
        </div>
        <div>
                      {agentTypes.map((item, index) => (
          <button
            className={` ${
              activeTab.id === item.id
                ? "bg-tertiary text-white"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
            } transition-all  rounded-full px-10 py-3 mx-2 `}
            onClick={() => setActiveTab(item)}
          >
            {item.name}
          </button>
        ))}
        </div>
        <div className="mt-4 mx-5">
        <ProductFilter />

        </div>
        <ProductTableList
          activeTab={activeTab}
        //   onRegisterReset={setResetChildState}
        //   isDownload={isDownload}
        //   handleDownloadComplete={() => setIsDoownload(false)}
        />
        </div>
      </div>

     
    </div>
  );
};

export default ProductList;
