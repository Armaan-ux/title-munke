// import "./index.css";
import Logo from "../../img/Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUp, ChevronRight, CircleCheck, Dot, MapPin, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "./footer";
import { useEffect, useState } from "react";
import { aboutUsListItems, faq, keyFeatures, previousSearches, testimonials, whyTitleMunke } from "@/utils/constant";
import Navbar from "./navbar";
import CountiesMapSvg from "./counties-map-svg";
import {motion} from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"




const trustedBy = ["mortage-connect.png", "/investors-title.png", "/rhythmic.png", "/catic.png",  "/ltc.png" ]


export default function Home() {


  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emblaRef] = useEmblaCarousel({dragFree: true})
  const navigate = useNavigate();
  function navigateToLogin() {
    navigate("/login");
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setShowBackToTop(window.scrollY > 700);
    });
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  return (

    <div>

      <div 
        // initial={{ opacity: 0, y: -20 }}
        // whileInView={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.6, ease: "easeOut" }}
        // viewport={{ once: true, amount: 0.3 }}
        className="bg-primary text-primary-foreground text-center px-2 py-1 " >
        <p className="flex items-center gap-2 justify-center" >
          Still doing manual searches? <b> Automate now </b> <ArrowRight className="size-5" />
        </p>
      </div>


    {/* navbar */}
    <Navbar />

      {/* hero section */}

      <motion.section       
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }} 
        className="py-10 lg:py-20 mb-20 bg-[#F5F0EC] px-4" 
      >

        <div className="flex flex-col md:flex-row justify-between *:basis-1/2 items-center max-w-[1280px] mx-auto gap-6 md:gap-0 " >

        <div className="space-y-10" >
          <h1 className="mb-6 text-h1" >The Smarter Way to Search Property <span className="text-tertiary" > Records </span></h1>
          <p className="md:mr-20 text-lg lg:text-xl" >AI-powered title searches delivered with speed and accuracy.  Helping brokers and agents make confident decisions. 
          </p>
          <div className="space-x-3" >
            <Link to="/login" >
              <Button size="lg" variant="outline" >Get Started <ArrowRight /></Button>
            </Link>
            <Button size="lg" variant="secondary" >Request a Demo <ArrowRight /></Button>
          </div>
        </div>

          <img src="/hero.png" className="w-full min-w-0" alt="property search" />
        </div>

      </motion.section>

      

      {/* About section */}
      <section 
        id="about"
        className="flex flex-col md:flex-row max-w-[1280px] mx-auto gap-10 items-center mb-42 *:basis-1/2 px-4 scroll-mt-20 " >

        <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }} 
        > 
          <img src="/property-collage.png" className="w-full" alt="house" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }} 
          >
            <h2 className="mb-3 text-h2 text-secondary" >About <span className="text-tertiary" > Title Munke </span></h2>
            <p className="text-body text-coffee-light mb-4 !leading-[34px]" >Title Munke is redefining title search with AI. As the first AI-powered title search platform in Pennsylvania, we’re transforming a process that traditionally takes days into a matter of minutes. Built for speed, accuracy, and transparency, our platform gives brokers, agents, and investors the clarity they need to close deals with confidence.</p>
            <ul className="text-body space-y-2 md:space-y-2 mb-6 " >
              {
                aboutUsListItems.map((item, index) => (
                  <li key={index} className="text-coffee-light text-body flex gap-2 !leading-[34px]" ><CircleCheck className="mt-0.5 shrink-0" />{item}</li>
                ))
              }
            </ul>
            <div className="space-x-3" >

            <Button size="lg" variant="outline" className="text-primary border-primary outline-primary" >View More</Button>
            <Button size="lg" >Request a Demo</Button>
            </div>
        </motion.div>
      </section>



      {/* How it works section */}
      <section className="px-4 scroll-mt-20 relative" id="how-it-works" >

        <div className="flex flex-col md:flex-row *:basis-1/2 items-start max-w-[1280px] mx-auto mb-20 rounded-xl max-h-full" >

              <div className="bg-coffee-bg text-primary-foreground space-y-10 p-5 md:p-10 xl:p-20 rounded-l-xl  max-md:rounded-t-xl sticky top-[25%]" >
                <h2 className="text-h2" >How It Works</h2>
                <p className="text-[#E6D5C7] font-normal text-body" >Getting a title report has never been easier. Just enter property details, and our AI instantly scans records, analyzes data, and delivers a complete report within minutes.</p>
                <Button size="lg" onClick={() => setOpenReportDialog(true)} >View a Sample Report <ArrowRight /> </Button>
              </div>


              <div>
              {
                [1, 2, 3].map((item, index) => {
                  return (
                  <motion.div 
                  // initial={{ opacity: 0 }}          // start hidden + pushed down
                  // whileInView={{ opacity: 1 }}       // animate when in view
                  // viewport={{  amount: 0.3 }}   // trigger once when 30% visible
                  // transition={{ duration: 0.5, delay: index * 0.2 }} // stagger per step
                className="bg-[#F5F0EC] p-5 md:p-10 sticky top-[25%] rounded-r-xl" 
                  >

                <div className="flex gap-5 " >
                  <div>
                    <Button 
                      variant="outline" 
                      className="rounded-full bg-transparent outline-primary border-primary border-2 text-primary hover:text-primary"
                    >
                      Step {item} <ArrowRight />
                    </Button>
                    <div className="border w-0 mx-auto border-dashed border-[#E0C2AA] h-[22rem]" />
                  </div>
                
                  <div className="space-y-10" >
                    <div>
                      <img src="/mac-window.png" alt="mac window" className="mx-auto" />
                      <h3 className="text-2xl font-semibold text-center text-secondary mb-4" >Search</h3>
                      <p className="text-center text-secondary text-body" >Our AI scans public records to gather relevant documents.</p>
                    </div>
                  </div>
             
                </div>
              </motion.div>
                  )
                })
              }

              </div>

        </div>

      </section>

      {/* Previous Searches */}
      <section className="max-w-[1280px] mx-auto mb-20 px-4 scroll-mt-20" id="previous-searches" >
        <h2 className="text-h2 text-center text-secondary mb-6" >Previous <span className="text-tertiary" > Searches Preview </span></h2>
        <p className="text-center text-body mb-12 max-w-5xl mx-auto text-coffee-light" >Each report is more than just an address. See ownership history, valuations, tax records, permits, and the original collected documents—all brought together in a clear, interactive breakdown.</p>

        <div className="flex flex-col md:flex-row gap-5 md:gap-6 mb-10" >
          <div className="" >
            <img src="/mansion.jpg" alt="mansion" className="mb-3 md:mb-7" />
            <p className="text-center flex items-center gap-2 md:gap-3 justify-center text-base md:text-xl" ><MapPin className="text-tertiary" />
             123 Maple Avenue, San Diego, CA
            </p>
          </div>
          <div className="flex flex-col items-center" >
            <div className="mb-2 max-md:flex *:min-w-0" >
            <img src="/map-highlight.jpg" alt="map highlight" className="mb-1 md:mb-5" />
            <img src="/map-field.jpg" alt="map field"  />
            </div>
            <p className="text-sm lg:text-base flex justify-between items-center gap-1 md:gap-2 font-semibold text-tertiary" >View more images <ChevronRight size={22} /></p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" >
          {
            previousSearches.map((item, index) => (
              <motion.div 
               initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
              key={index} className="flex flex-col items-center gap-4 p-6 py-8 rounded-[20px] shadow-[0px_4px_14px_0px_#D7C4B666]" >
                <div className="bg-[#F5F0EC] rounded-full size-[68px] grid place-items-center text-center" >
                  <img src={item.icon}  alt={item.title} />
                </div>
                <h3 className="text-xl font-semibold text-secondary text-center" >{item.title}</h3>
                <p className="text-center text-coffee-light" >{item.description}</p>
              </motion.div>
            ))
          }
        </div>
        <div className="flex justify-center my-10 w-full" >
          <Button size="lg" onClick={() => setOpenReportDialog(true)} >View Full Report <ArrowRight /></Button>
        </div>

      </section>


      {/* Why choose Title Munke? */}
      <section className="px-4" >
        <section className="max-w-[1725px] mx-auto mb-20 bg-coffee-bg rounded-[30px]" >

          <div className="max-w-[1280px] mx-auto p-5 lg:p-10 py-10 lg:py-16 text-center" >
            <h2 className="text-h2 text-center mb-2 text-secondary-foreground" >Why choose Title Munke?</h2>
            <p className="text-[#D7C4B6] text-center mb-12 text-body" >Quickly revisit your recently searched properties in a simple card view. See photos, addresses</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 " >
              {
                whyTitleMunke.map((item, index) => (
                  <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                  key={index} className="flex flex-col items-center bg-coffee-dark p-6 sm:p-10 rounded-[30px]"  >
                      <img src={item.icon} className="mb-6" alt={item.title} />
                      <h3 className="text-2xl font-semibold mb-2 text-center text-primary-foreground" >{item.title}</h3>
                      <p className="text-body text-center text-[#D7C4B6]" >{item.description}</p>
                  </motion.div>
                ))
              }
            </div>
          </div>
        </section>
      </section>


      {/* Counties Map */}
      <section className="max-w-[1280px] mx-auto mb-10 px-4 scroll-mt-20" id="counties" >
        <h2 className="text-h2 text-center mb-4" >Counties <span className="text-tertiary" > Map </span></h2>
        <p className="text-center text-[22px] mb-4 text-coffee-light" >Pennsylvania • 67 Counties</p>

        {/* <img src="/map.png" className="mx-auto" alt="map" /> */}
        <CountiesMapSvg />

      </section>

      {/* Trusted by Leading Brokers & Agents */}
      <section className="max-w-[1440px] mx-auto mb-20" >
        <h4 className="text-center font-bold text-secondary mb-3" >Trusted by Leading Brokers & Agents</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-center w-full justify-between" >
          {
            trustedBy.map((item, index) => (
              <img key={index} src={item} className="" alt="trusted by companies" />
            ))
          }
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1280px] mx-auto mb-20 px-4" >
        <h2 className="text-h2 text-center mb-10 text-secondary" >Frequently Asked <span className="text-tertiary" > Questions </span></h2>
        <Accordion className="max-w-3xl mx-auto space-y-4 mb-4" type="multiple" >
          {
            faq.map((item, index) => (
              <AccordionItem key={index} value={(index + 1)?.toString()} className="border rounded-xl p-2 md:p-4 px-4 md:px-8 last:border-b" >
                <AccordionTrigger className="text-xl font-bold text-secondary *:text-secondary!" >{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-coffee-light mb-4" >{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>
      </section>


     {/* Trusted by Professionals */}
      <section className="px-4" >

      <div className="max-w-[1725px] mx-auto mb-20 bg-coffee-bg rounded-[30px] p-5 md:p-10 xl:p-20 pr-0" >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" >

          <div className="relative" >
            <img src="/quote.svg" alt="quote icon" className="max-w-[40%] md:max-w-[55%] lg:ml-auto mr-20" />
            <h2 className="text-h2 text-primary-foreground absolute inset-0 z-10 top-[30%] max-w-xs lg:ml-auto" >Trusted by Professionals</h2>
          </div>
      
        <div className="col-span-2" >

          <div ref={emblaRef} className="overflow-hidden mb-8" >
            <div className="flex gap-8" >
              {
                testimonials.map((item, index) => (
                  <div key={index} className="relative p-8 rounded-[30px] bg-coffee-dark min-w-0 flex-[0_0_75%] md:flex-[0_0_40%]" >
                    <p className=" text-[#E6D5C7] mb-8" >{item.content}</p>
                    <p className="text-[#E6D5C7]" >{item.name}</p>
                    <p className="text-sm text-coffee-bg-foreground" >{item.role}</p>
                    <img src="/card-corner.png" className="absolute -bottom-[1px] -right-[1px] border-none" alt="card corner" />
                    <img src={item.image} className="absolute bottom-0 right-0 z-10 border-none" alt="profile" />
                  </div>
                ))
              }
            </div>
          </div>

          {/* <div className="flex justify-between max-w-4xl items-center" >
            <div className="flex gap-3 items-center" >  
              <p className="text-[58px] text-coffee-bg-foreground font-bold" >4.82</p>
              <div>
                <div className="*:fill-yellow-500 *:text-yellow-500 flex gap-1 bg-[#987555] p-1.5 rounded-full" >
                  <Star size={14} />
                  <Star size={14} />
                  <Star size={14} />
                  <Star size={14} />
                  <Star size={14} />
                </div>
                <p className="text-coffee-bg-foreground text-sm text-center" >2,488 Rating</p>
              </div>

            </div>

            <div className="flex items-center justify-center " >
              <Dot />
              <Dot />
              <Dot />
            </div>
          </div> */}

        </div>

        </div>
      </div>

      </section>


      {/* key features */}
      <section className="max-w-[1280px] mx-auto mb-20 px-4" >
        <h2 className="text-h2 text-center text-secondary mb-6" >Our <span className="text-tertiary" > Key Features </span></h2>
        <p className="text-center max-w-3xl mx-auto mb-10 text-body text-coffee-light" >Quickly revisit your recently searched properties in a simple card view. See photos, addresses, and instantly access detailed reports with one click.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10" >
            {
              keyFeatures.map((item, index) => (
                <motion.div 
                  key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                  className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-[20px] shadow-[0px_4px_14px_0px_#D7C4B666] hover:shadow-[0px_28px_34px_0px_#D7C4B666] transition-shadow"  >
                  <img src={item.icon} className="h-auto mb-2" alt={item.title} />
                    <h3 className="text-2xl font-semibold text-secondary text-center" >{item.title}</h3>
                    <p className="text-body text-center text-secondary" >{item.description}</p>
                </motion.div>
              ))
            }
        </div>
      </section>


      {/* Request a Demo */}
      <section className="px-4 scroll-mt-20" id="request-demo" >

        <div className="max-w-[1725px] mx-auto mb-10 bg-coffee-bg rounded-[30px] p-5 md:p-10" >
            <h2 className="text-h2 mb-3 md:mb-6 text-center text-primary-foreground" >Request a Demo</h2>
            <p className="text-[#BEA998] text-body text-center max-w-2xl mx-auto mb-6 md:mb-10" >Discover how our solution works for your needs. Fill in your details to schedule a personalized demo and explore the features firsthand.</p>
            <form action="" className="max-w-xl mx-auto" >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 *:!rounded-[8px] *:placeholder:text-coffee-bg-foreground *:h-12 *:!border-[#977466] *:text-white" >
                <Input className="" placeholder="Name" label="Name" required />
                {/* <Input className="" placeholder="State" label="State" required /> */}
                <Select>
                  <SelectTrigger className="w-full !h-12 data-[placeholder]:!text-coffee-bg-foreground [&_svg]:!text-coffee-bg-foreground">
                    <SelectValue placeholder="State" className="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="" placeholder="Email" label="Email" type="email" required />
                <Input className="" placeholder="Country" label="Country" type="text" required />
                <Textarea className="sm:col-span-2 placeholder:!text-[#A78B7F] placeholder:italic" placeholder="Enter additional info here..." label="Message" required />
              </div>
              <div className="flex justify-center" >
                <Button size="lg"  className="text-tertiary bg-coffee-bg-foreground hover:bg-coffee-bg-foreground/90" >Submit <ArrowRight /></Button>
              </div>
            </form>
        </div>
      </section>


      <Footer />



      <div 
        className={`fixed bottom-2 right-2 z-10 flex items-center gap-2 p-3 text-secondary pt-8 hover:opacity-100 ${showBackToTop ? 'opacity-40': 'opacity-0'} transition-all `} 
      >
        <p className="hidden md:block" >Back to top</p>
        <Button 
          size="icon" 
          className="size-10"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          
         >
          <ArrowUp />
        </Button>
      </div>




      {/* Report Dialog */}
      <Dialog open={openReportDialog} onOpenChange={setOpenReportDialog}>
        <DialogContent className="!max-w-4xl w-full max-h-[90vh] flex flex-col !px-2" >
          <DialogHeader className="px-5" >
            <div className="flex items-center justify-center py-2 pb-4  border-b-[1px] border-[#E8D0A7]" >
              <img src="/Logo.svg" className="w-16 absolute left-6" alt="Title Munke Logo" />
              <h4 className="text-center text-[28px] font-semibold"  >Sample Report Breakdown</h4>
            </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-10 h-full overflow-auto px-5" >
              <div className="space-y-6" >
                <img src="/report-map.jpg" alt="map highlight" className="mb-1 md:mb-5" />
                <img src="/report-mansion.jpg" alt="mansion" className="mb-1 md:mb-5" />
                <ListForReport />
                <ListForReport />
                <ListForReport />
              </div>
              <div className="space-y-6" >
                <ListForReport />
                <ListForReport />
                <ListForReport />
                <ListForReport />
                <ListForReport />
              </div>
            </div>
            {/* <DialogTitle className="text-center text-[28px]" >Sample Report Breakdown</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription> */}
            <DialogFooter>
              <div className="mt-1 flex justify-center gap-4 w-full" >
                <Button size="lg" >Download Now</Button>
                <Button variant="outline" className="outline-primary border-primary text-primary" size="lg" onClick={() => setOpenReportDialog(false)}  >Close</Button>
              </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function ListForReport(){
  return(
    <div>
      <p className="text-[22px] mb-2 font-semibold text-secondary " >Easements / Restrictions</p>
       <ul className="space-y-1 md:space-y-2 !list-disc list-outside *:ml-5 *:text-secondary" >
       <li className="font-semibold" >Utility access easement (2020)</li>
       <li className="font-semibold" >Drainage restriction (2019)</li>
       <li><span className="font-semibold" > Why it matters: </span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in tyreyu maximus augue.</li>
      </ul>
    </div>
    
  )
}