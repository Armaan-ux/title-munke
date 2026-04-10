import { useEffect, useState, useRef } from "react";
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
  const [activeSection, setActiveSection] = useState("");
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      const sections = navItems.map((item) => document.getElementById(item.path)).filter(Boolean);
      let currentSection = "";

      // Look slightly further down the screen to trigger earlier when scrolling down
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.id;
          break;
        }
      }

      if (window.scrollY === 0) {
        currentSection = navItems[0]?.path;
      }

      setActiveSection((prev) => currentSection ? currentSection : prev);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    navigate("/");
    setActiveSection(id);
    isScrolling.current = true;
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Unlock scroll tracking after animation completes
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
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
                className={`transition-all text-lg cursor-pointer ${activeSection === item.path
                    ? "text-tertiary border-b-2 border-tertiary pb-1"
                    : "text-[#554536] hover:text-tertiary"
                  }`}
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
                        className={`text-lg cursor-pointer transition-all ${activeSection === item.path
                            ? "text-tertiary border-b-2 border-tertiary w-max pb-1"
                            : "text-[#554536]"
                          }`}
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
