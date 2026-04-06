import { Button } from "@/components/ui/button";
import { navItems } from "@/utils/constant";
import { ArrowRight, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = (id) => {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    
  };

  return (
    <header
      className={`shadow-md sticky top-0 z-50 bg-white transition-transform duration-300`}
    >
      {/* <header className={`shadow-md sticky top-0 z-50 bg-white transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}> */}
      <nav className="flex justify-between items-center gap-4 md:gap-12 max-w-[1280px] mx-auto px-4">
        <img src="/Logo.svg" alt="logo" className="w-16 md:w-20 h-auto" />

        <div className="hidden lg:flex justify-end flex-1 gap-6 xl:gap-12 max-w-[64rem]">
          <ul className="flex items-center gap-2 justify-between flex-1">
            {navItems.map((item) => (
              <li
                onClick={() => scrollToSection(item.path)}
                key={item.name}
                className="text-[#554536] hover:text-tertiary transition-all text-lg cursor-pointer"
              >
                {item.name}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Button
              className="hover:scale-105"
              size="lg"
              onClick={() => scrollToSection("request-demo")}
            >
              Request a Demo
            </Button>
            <Button
              className="hover:scale-105"
              size="lg"
              variant="secondary"
              onClick={() => navigate("/subscription-login")}
            >
              Login <ArrowRight />
            </Button>
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
                      <li
                        key={item.name}
                        className="text-[#554536] text-lg"
                        onClick={() => {
                          scrollToSection(item.path);
                        }}
                      >
                        <SheetClose>{item.name}</SheetClose>
                      </li>
                    ))}
                  </ul>
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    onClick={() => scrollToSection("request-demo")}
                  >
                    Request a Demo
                  </Button>
                  {/* <Link to="/subscription-login" > */}
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate("/subscription-login")}
                  >
                    Login <ArrowRight />
                  </Button>
                  {/* </Link> */}
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
