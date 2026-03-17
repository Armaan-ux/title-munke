import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductTableList from "@/components/Admin/Setting/Pricing/product-table-list";
import ProductFilter from "@/components/common/product-filter";
import ProductModal from "@/components/Modal/ProductModal";

const ProductList = () => {
  const agentTypes = [
    {
      name: "Organization",
      id: "organisation",
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
  const [active, setActive] = useState("all");
  const [showModal , setShowModal] = useState(false);

  return (
    <>
      <ProductModal open={showModal} onClose={() => setShowModal(false)} activeTab={activeTab} />
    
    <div className="bg-[#F5F0EC] flex items-start justify-start text-secondary">
      <div className="bg-white rounded-xl p-8 w-full">
        <div className="flex flex-col">
          <div className="mb-5 flex items-center justify-between gap-4 border-b pb-5">
            <p className="text-xl font-medium">Profile Details</p>
            <Button variant="secondary" size="lg" onClick={() => setShowModal(true)}>
              Create Product
            </Button>
          </div>
          <div>
            {agentTypes.map((item, index) => (
              <button
                className={` ${
                  activeTab.id === item.id
                    ? "bg-tertiary text-white"
                    : "bg-[#F5F0EC] hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
                } transition-all  rounded-full px-10 py-3 mx-2 `}
                onClick={() => setActiveTab(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="mt-4 mx-5">
            <ProductFilter active={active} setActive={(value) => setActive(value)} />
          </div>
          <ProductTableList
            activeTab={activeTab}
            activeFilter={active}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductList;
