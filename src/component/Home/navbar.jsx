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

export default function Navbar() {
    return (
            <header className=" shadow-md" >
            
             <nav className="flex justify-between items-center gap-4 md:gap-12 max-w-[1280px] mx-auto px-4" >
                {/* <div>Icon</div> */}
                <img src="/src/img/Logo.svg" alt="logo" className="w-16 md:w-20 h-auto" />
        
        
                <div className="hidden lg:flex justify-end flex-1 gap-6 xl:gap-12 max-w-[60rem]" >
                  <ul className="flex items-center gap-2 justify-between flex-1" >
                    {navItems.map((item) => (
                      <li key={item.name}>
                        <Link to={item.path} className="text-[#554536] text-lg" >{item.name}</Link>
                      </li>
                    ))}
                  </ul>
        
                  <div className="flex items-center gap-4" >  
                    <Button size="lg" >Request Demo</Button>
                    <Button size="lg" variant="secondary"  >Login <ArrowRight /> </Button>
                  </div>
                </div>
                <div className="block lg:hidden" >

                    <Sheet>
                    <SheetTrigger className="flex items-center" >
                        {/* <Button size="icon" className="size-10" >
                        </Button> */}
                            <Menu  />
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                        <SheetTitle className="text-lg" >Menu</SheetTitle>
                        <SheetDescription>
                            <ul className="my-8 space-y-5" >
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        <Link to={item.path} className="text-[#554536] text-lg" >{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </SheetDescription>
                        </SheetHeader>
                    <SheetFooter>
                        <div className="flex flex-col gap-3" >  
                            <Button size="lg" >Request Demo</Button>
                            <Button size="lg" variant="secondary"  >Login <ArrowRight /> </Button>
                        </div>
                    </SheetFooter>
                    </SheetContent>
                    </Sheet>




                </div>
             </nav>
            </header>
    )
}