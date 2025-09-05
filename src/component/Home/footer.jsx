import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Minus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" bg-gradient-to-b from-[#FFFFFF] to-[#FFF8EB]" >

    <div className="flex flex-col lg:flex-row gap-6 max-w-[1280px] mx-auto p-4 md:p-10" >

    <div className="flex gap-6 max-w-[25rem] w-full"   >
      <div>
        <img src="/Logo.svg" alt="title munke" className="" />
      </div>

      <div className="max-w-[14rem] w-full mt-6" >
        <p className="mb-4 text-secondary text-[22px]" >Quick Links</p>
        <ul className="space-y-3 sm:space-y-5 *:text-[#554536] *:flex *:items-center *:gap-3" >
            <li><Minus /><Link className="text-body" >Home</Link></li>
            <li><Minus /><Link className="text-body" >How It Works</Link></li>
            <li><Minus /><Link className="text-body" >Counties</Link></li>
            <li><Minus /><Link className="text-body" >Sample Report</Link></li>
        </ul>
      </div>
    </div>

    <div className="flex flex-col md:flex-row gap-6" >

        <div>
            <div className="p-6 mb-4 bg-white rounded-[20px] space-y-4 " >
                <p className="text-[22px] text-secondary" >Let's Get Start</p>
                <Button size="lg" className="w-full hover:scale-105" >Request a Demo  <ArrowRight /></Button>
                <Link to="/login" >
                    <Button size="lg" variant="secondary" className="w-full hover:scale-105" >Login <ArrowRight /></Button>
                </Link>
            </div>
            <div className="pl-6" >
                <p className="text-[22px] text-secondary mb-4" >Get in Touch</p>
                <div className="flex justify-between *:-m-3 *:box-content" >
                    <Link to="mailto:info@titlemunke.com" target="_blank" className="!-m-0.5 hover:scale-110 transition-all flex-none p-2.5 h-fit bg-secondary text-white  rounded-full" >
                        <Mail size={19} className="text-white/70" />
                    </Link>
                    <Link to="https://x.com/TitleMunke" target="_blank" className="hover:scale-110 transition-all" >
                        <img src="/x.svg" alt="x twitter" />
                    </Link>
                    <Link to="https://www.instagram.com/titlemunke" target="_blank" className="hover:scale-110 transition-all" >
                        <img src="/instagram.svg" alt="facebook" />
                    </Link>
                    <Link to="https://www.linkedin.com/company/titlemunke" target="_blank" className="hover:scale-110 transition-all" >
                        <img src="/linkedin.svg" alt="linkedin" />
                    </Link>
                </div>
            </div>
        </div>

        <div className="space-y-5 p-6 bg-white  rounded-[20px]" >
            <p className="text-secondary text-[22px] font-medium" >Subscribe to Newsletter</p>
            <p className="text-secondary text-body leading-loose" >Enter your email address to register to our newsletter subscription</p>
            <Input placeholder="Enter email" label="Email" type="email" className="h-12 !rounded-[10px] !border-[#E4D8C2] " required />
            <Button  size="lg" className="w-full hover:scale-105" >Subscribe <ArrowRight /></Button>              
        </div>

    </div>

    </div>

    <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between gap-2 md:gap-4 items-center p-3 text-body border-t pt-4 md:pt-8" >
        <p className="text-[#BEA998]" >© 2025 Title Munke. All rights reserved.</p>
        <div className="flex gap-6 text-[#7C6055] text-sm md:text-base" >
            <Link>Privacy Policy</Link>
            <Link>Terms of Service</Link>
        </div>
    </div>

    </footer>
  );
}