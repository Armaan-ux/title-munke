import Navbar from "../Home/navbar";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";


const Pricing = () => {
  return (
    <div>
      <div className=" flex items-center justify-center text-base bg-primary text-primary-foreground text-center px-2 py-1 ">
              <p className="">
                Still doing manual searches?{" "}
                <Link to="/login" className="inline-flex items-center gap-2">
                  {" "}
                  <b> Automate now </b> <ArrowRight className="size-5" />{" "}
                </Link>
              </p>
            </div>
      
            {/* navbar */}
            <Navbar />
    </div>
  )
}

export default Pricing