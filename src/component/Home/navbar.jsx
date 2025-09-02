import { Button } from "@/components/ui/button";
import { navItems } from "@/utils/constant";
import { ArrowRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect } from "react";

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const scrollToSection = (id) => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          // Scrolling down and past 50px
          setIsVisible(false);
        } else {
          // Scrolling up or near top
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
      <header className={`shadow-md sticky top-0 z-50 bg-white transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <nav className="flex justify-between items-center gap-4 md:gap-12 max-w-[1280px] mx-auto px-4">
          <img src="/src/img/Logo.svg" alt="logo" className="w-16 md:w-20 h-auto" />
          
          <div className="hidden lg:flex justify-end flex-1 gap-6 xl:gap-12 max-w-[60rem]">
            <ul className="flex items-center gap-2 justify-between flex-1">
              {navItems.map((item) => (
                <li 
                  onClick={() => scrollToSection(item.path)} 
                  key={item.name} 
                  className="text-[#554536] text-lg cursor-pointer"
                >
                  {item.name}
                </li>
              ))}
            </ul>
            
            <div className="flex items-center gap-4">
              <Button size="lg" onClick={() => scrollToSection("request-demo")}  >Request a Demo</Button>
              <Link to="/login" >
                <Button size="lg" variant="secondary">Login <ArrowRight /></Button>
              </Link>
            </div>
          </div>
          
          <div className="block lg:hidden">
            <Sheet>
              <SheetTrigger className="flex items-center">
                <Menu />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-lg">Menu</SheetTitle>
                  <SheetDescription>
                    <ul className="my-8 space-y-5">
                      {navItems.map((item) => (
                        <li key={item.name}>
                          <Link to={item.path} className="text-[#554536] text-lg">{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <div className="flex flex-col gap-3">
                    <Button size="lg" onClick={() => scrollToSection("request-demo")} >Request a Demo</Button>
                    <Link to="/login" >
                      <Button size="lg" variant="secondary">Login <ArrowRight /></Button>
                    </Link>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    );
}