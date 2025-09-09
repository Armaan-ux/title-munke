import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUp,
  CircleCheck,
  Download,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Footer from "./footer";
import { useEffect, useState } from "react";
import {
  aboutUsListItems,
  faq,
  howItWorksSteps,
  keyFeatures,
  sampleReportItems,
  testimonials,
  trustedBy,
  whyTitleMunke,
} from "@/utils/constant";
import Navbar from "./navbar";
import CountiesMapSvg from "./counties-map-svg";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";



export default function Home() {
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emblaRef] = useEmblaCarousel({ dragFree: true });

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setShowBackToTop(window.scrollY > 700);
    });
    return () => {
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  return (
    <div>
      {/* Announcement */}

      
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

      {/* hero section */}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-10 lg:py-20 xl:py-32 mb-16 md:mb-20  px-4 relative"
        id="home"
      >
        <img
          src="/hero-bg.png"
          className="absolute top-0 left-0 w-full h-full -z-10"
          alt="hero"
        />

        <div className="flex flex-col md:flex-row justify-between *:basis-1/2 items-center max-w-[1280px] mx-auto gap-6 md:gap-0 ">
          <div className="space-y-10">
            <h1 className="mb-6 text-h1">
              The Smarter Way to Search Property{" "}
              <span className="text-tertiary"> Records </span>
            </h1>
            <p className="md:mr-20 text-lg lg:text-xl text-secondary">
              AI-powered title searches delivered with speed and accuracy.
              Helping brokers and agents make confident decisions.
            </p>
            <div className="space-x-3">
              <Link to="/login">
                <Button className="hover:scale-105" size="lg" variant="outline">
                  Get Started <ArrowRight />
                </Button>
              </Link>
              <Button
                className="hover:scale-105"
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection("request-demo")}
              >
                Request a Demo <ArrowRight />
              </Button>
            </div>
          </div>

          <img
            src="/hero.png"
            className="w-full min-w-0"
            alt="property search"
          />
        </div>
      </motion.section>


      {/* About section */}
      <section
        id="about"
        className="flex flex-col md:flex-row max-w-[1280px] mx-auto gap-10 items-center mb-20 md:mb-42 *:basis-1/2 px-4 scroll-mt-20 "
      >
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
          <h2 className="mb-3 text-h2 text-secondary">
            About <span className="text-tertiary"> Title Munke </span>
          </h2>
          <p className="text-body text-coffee-light mb-4 !leading-[34px]">
            Title Munke is redefining title search with AI. As the first
            AI-powered title search platform in Pennsylvania, we’re transforming
            a process that traditionally takes days into a matter of minutes.
            Built for speed, accuracy, and transparency, our platform gives
            brokers, agents, and investors the clarity they need to close deals
            with confidence.
          </p>
          <ul className="text-body space-y-2 md:space-y-2 mb-6 ">
            {aboutUsListItems.map((item, index) => (
              <li
                key={index}
                className="text-coffee-light text-body flex gap-2 !leading-[34px]"
              >
                <CircleCheck className="mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="space-x-3">
            <Button
              size="lg"
              variant="outline"
              className="text-primary border-primary outline-primary hover:scale-105"
            >
              View More
            </Button>
            <Button
              size="lg"
              className="hover:scale-105"
              onClick={() => scrollToSection("request-demo")}
            >
              Request a Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* How it works section */}
      <section
        className="px-4 scroll-mt-20 relative mb-20 lg:mb-32"
        id="how-it-works"
      >
        <div className="flex flex-col md:flex-row *:basis-1/2 items-start max-w-[1280px] mx-auto mb-20 rounded-xl max-h-full">
          <div className="bg-coffee-bg text-primary-foreground space-y-10 p-5 md:p-10 xl:p-20 rounded-l-xl  max-md:rounded-t-xl sticky top-[10%] md:top-[25%]">
            <h2 className="text-h2">How It Works</h2>
            <p className="text-[#E6D5C7] font-normal text-body">
              Getting a title report has never been easier. Just enter property
              details, and our AI instantly scans records, analyzes data, and
              delivers a complete report within minutes.
            </p>
            <Button
              size="lg"
              onClick={() => setOpenReportDialog(true)}
              className="hover:scale-105"
            >
              View a Sample Report <ArrowRight />{" "}
            </Button>
          </div>

          <div>
            {howItWorksSteps.map((item, index) => {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.6 }}
                  key={index}
                  className="bg-[#F5F0EC] p-5 md:p-10 sticky top-[10%] md:top-[25%] rounded-r-xl"
                >
                  <div className="flex gap-2 md:gap-5 ">
                    <div>
                      <Button
                        variant="outline"
                        className="rounded-full bg-transparent outline-primary border-primary border-2 text-primary hover:text-primary text-sm md:text-base"
                      >
                        Step {index + 1} <ArrowRight />
                      </Button>
                      <div className="border w-0 mx-auto border-dashed border-[#E0C2AA] h-[22rem]" />
                    </div>

                    <div className="space-y-10">
                      <div>
                        <img
                          src={item.img}
                          alt={item.title}
                          className="mx-auto max-w-[14rem] mb-5"
                        />
                        <h3 className="text-2xl font-semibold text-center text-secondary mb-4">
                          {item.title}
                        </h3>
                        <p className="text-center text-secondary text-body">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section> 

      {/* Sample Report  */}
      {/* <section  className="max-w-[1280px] mx-auto mb-10 px-4 space-y-10 scroll-mt-20 py-10 md:py-20" id="report-preview"   >
          <h2 className="text-h2 mb-12 text-center text-secondary"  >Sample Report </h2>

        

      <motion.div 
            // initial={{ opacity: 0, y: 0 }}
            // whileInView={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.6, ease: "easeOut" }}
            // viewport={{ once: true, amount: 0.3 }}
            className={`flex flex-col lg:flex-row py-20 rounded-4xl  p-4 md:p-10 *:basis-1/2 gap-8 justify-center items-start  bg-[#F5F0EC] `} 
            // key={index} 
            >
            <div className="lg:sticky top-[15%] " >
              <img
                src="/sample-report/2041 Sample Report_page.jpg"
                className="w-full md:max-w-[80%] mx-auto"
                alt="final sample report"
                />
            </div>
            <div className="space-y-44 " >
                {
                  sampleReportItems.map((item, index) => (
                <div className="sticky z-20 min-h-[60vh] md:min-h-[80vh] top-[10%] md:top-[15%] bg-[#F5F0EC] p-0 sm:p-5  flex" >  

                  <img
                    src={item.img}
                    className="absolute top-0 left-0 w-full h-full -z-10  opacity-20 blur-[1px] " 
                    alt="final sample report"
                />
                <ListForReport
                  titleClass="md:text-2xl mb-8"
                  listClass="md:text-base"
                  title={item.title}
                  items={item.content}
                  containerClass="mx-auto bg-gradient-to-b from-transparent via-white to-transparent px-4 md:px-[42px] py-12 last:pb-0 md:py-[120px] rounded-[10px]"
                  />
                </div>
            ))}
            </div>
          </motion.div>
        <div className="flex justify-center w-full">
          <Link to="/public/Sample Docs.zip" target="_blank" download>
            <Button className="hover:scale-105" size="lg">
              Download Sample Report <Download />
            </Button>
          </Link>
        </div>
      </section> */}

      <section  className="max-w-[1280px] mx-auto mb-10 px-4 space-y-10 scroll-mt-20 py-20" id="report-preview"   >
          <h2 className="text-h2 mb-12 text-center text-secondary"  >Sample Report </h2>

        
          {
            sampleReportItems.map((item, index) => (

          <motion.div 
          initial={{ opacity: 0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className={`flex flex-col max-h-[70vh] overflow-hidden md:flex-row py-20 rounded-4xl   p-10 *:basis-1/2 gap-8 justify-center items-center sticky bg-[#F5F0EC] top-[12%] md:top-[15%] ${sampleReportItems.length === index + 1  ? "mb-20":"mb-44"  }`} 
          key={index} 
          > 
          <div className="py-2 h-full" >
            <img src={item.img} className=" max-w-[70%] mx-auto min-w-0" alt="mansion" />
          </div>
            <div>
              <ListForReport
                titleClass="md:text-3xl mb-8"
                listClass="md:text-lg"
                title={item.title}
                items={item.content}
              />

            </div>
          </motion.div>
          ))
          }
          <div className="flex justify-center w-full" >
            <Link to="/public/pdf/report.pdf" target="_blank" download>
            <Button
              className="hover:scale-105"
              size="lg"
              >Download Sample Report <Download /></Button>
            </Link>
          </div>
      </section>


      {/* v2 */}
      {/* <section  className="max-w-[1440px] mx-auto mb-10 px-4 space-y-10 scroll-mt-20 py-10 md:py-20" id="report-preview"   >
          <h2 className="text-h2 mb-12 text-center text-secondary"  >Sample Report </h2>

      
      <motion.div 
            className={`flex flex-col lg:flex-row py-20 rounded-4xl  p-4 md:p-10 gap-8 justify-center items-start  bg-[#F5F0EC] `} 
            >
            <div className="lg:sticky top-[16%] basis-[35%]" >
              <img
                src="/sample-report/2041 Sample Report_page.jpg"
                className="w-full "
                alt="final sample report"
                />
            </div>
            <div className="space-y-44 basis-[65%] " >
                {
                  sampleReportItems.map((item, index) => (
                <div className=" sticky z-20 h-full top-[8%] md:top-[12%] last:mb-6 last:pb-0 bg-[#F5F0EC] min-h-[90vh] md:min-h-[80vh] flex flex-col-reverse md:flex-row gap-4 items-center p-4" >  

                  <img
                    src={item.img}
                    className=" min-w-0  object-contain max-w-xs mx-auto basis-[40%]" 
                    alt="final sample report"
                />
                <ListForReport
                  titleClass="md:text-2xl mb-8"
                  listClass="md:text-base"
                  title={item.title}
                  items={item.content}
                  containerClass="mx-auto basis-[60%] px-4  last:pb-0  rounded-[10px]"
                  />
                </div>
            ))}
            </div>
          </motion.div>
        <div className="flex justify-center w-full">
          <Link to="/public/Sample Docs.zip" target="_blank" download>
            <Button className="hover:scale-105" size="lg">
              Download Sample Report <Download />
            </Button>
          </Link>
        </div>

      </section> */}


      {/* Why choose Title Munke? */}

        <section className="px-4">
        <div className="max-w-[1725px] mx-auto mb-20 bg-coffee-bg rounded-[30px]">
          <div className="max-w-[1280px] mx-auto p-5 lg:p-10 py-10 lg:py-16 text-center">
            <h2 className="text-h2 text-center mb-2 text-secondary-foreground">
              Why choose Title Munke?
            </h2>
            <p className="text-[#D7C4B6] text-center mb-12 text-body">
              Quickly revisit your recently searched properties in a simple card
              view. See photos, addresses
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
              
              {whyTitleMunke.map((item, index) => (
                <motion.div
                     key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >


                <div
             
                  className="flex flex-col items-center hover:bg-coffee-dark/70 transition-all duration-500 bg-coffee-dark p-6 sm:p-10 rounded-[30px]"
                >
                  <img src={item.icon} className="mb-6" alt={item.title} />
                  <h3 className="text-2xl font-semibold mb-2 text-center text-primary-foreground">
                    {item.title}
                  </h3>
                  <p className="text-body text-center text-[#D7C4B6]">
                    {item.description}
                  </p>
                </div>
                </motion.div>

              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Counties Map */}
      <section
        className="max-w-[1280px] mx-auto mb-10 px-4 scroll-mt-20"
        id="counties"
      >
        <h2 className="text-h2 text-center mb-4">
          Counties <span className="text-tertiary"> Map </span>
        </h2>
        <p className="text-center text-[22px] mb-4 text-coffee-light">
          Pennsylvania • 67 Counties
        </p>

        {/* <img src="/map.png" className="mx-auto" alt="map" /> */}
        <CountiesMapSvg />
      </section>

      {/* Trusted by Leading Brokers & Agents */}
      <section className="max-w-[1440px] mx-auto mb-20 lg:mb-36">
        <h4 className="text-center font-bold text-secondary mb-3">
          Trusted by Leading Brokers & Agents
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 items-center w-full justify-between place-items-center">
          {trustedBy.map((item, index) => (
            <img
              key={index}
              src={item}
              className="w-24 sm:w-36 object-contain"
              // width={150}
              // height={150}
              alt="trusted by companies"
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1280px] mx-auto mb-20 px-4">
        <h2 className="text-h2 text-center mb-10 text-secondary">
          Frequently Asked <span className="text-tertiary"> Questions </span>
        </h2>
        <Accordion className="max-w-3xl mx-auto  mb-4" type="multiple">
          <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.2 },
                    },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
            className="space-y-2 md:space-y-4"
          >
            {faq.map((item, index) => (
              <motion.div
                key={index}
                variants={{
                    hidden: { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.4, ease: "easeOut" },
                    },
                  }}
              >
              <div

                className="hover:scale-105 transition-all duration-500"
              >
                <AccordionItem
                  value={(index + 1).toString()}
                  className="border rounded-xl p-2 md:p-4 px-4 md:px-8 last:border-b "
                >
                  <AccordionTrigger className="text-xl font-bold text-secondary *:text-secondary! ">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-base text-coffee-light space-y-2">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </div>
              </motion.div>
            ))}
          </motion.div>
        </Accordion>
      </section>

      {/* Trusted by Professionals */}
      <section className="px-4">
        <div className="max-w-[1725px] mx-auto mb-20 bg-coffee-bg rounded-[30px] p-5 md:p-10 xl:p-20 pr-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <img
                src="/quote.svg"
                alt="quote icon"
                className="max-w-[40%] md:max-w-[55%] lg:ml-auto mr-20"
              />
              <h2 className="text-h2 text-primary-foreground absolute inset-0 z-10 top-[30%] max-w-xs lg:ml-auto">
                Trusted by Professionals
              </h2>
            </div>

            <div className="col-span-2">
              <div ref={emblaRef} className="overflow-hidden mb-8">
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.25 },
                    },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  className="flex gap-4 md:gap-8"
                >
                  {testimonials.map((item, index) => (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 40 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.6, ease: "easeOut" },
                        },
                      }}
                      key={index}
                      className="relative p-4 md:p-8 rounded-[30px] bg-coffee-dark min-w-0 flex-[0_0_75%] md:flex-[0_0_40%]"
                    >
                      <p className=" text-[#E6D5C7] mb-8">{item.content}</p>
                      <p className="text-[#E6D5C7]">{item.name}</p>
                      {/* <p className="text-sm text-coffee-bg-foreground">
                        {item.role}
                      </p> */}
                      <img
                        src="/card-corner.png"
                        className="absolute -bottom-[1px] -right-[1px] border-none"
                        alt="card corner"
                      />
                      <img
                        src={"/user-placeholder.png"}
                        className="absolute bottom-0 right-0 z-10 size-14 rounded-full  border-none"
                        alt="profile"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* key features */}
      <section className="max-w-[1280px] mx-auto mb-20 px-4">
        <h2 className="text-h2 text-center text-secondary mb-6">
          Our <span className="text-tertiary"> Key Features </span>
        </h2>
        <p className="text-center max-w-3xl mx-auto mb-10 text-body text-coffee-light">
          Quickly revisit your recently searched properties in a simple card
          view. See photos, addresses, and instantly access detailed reports
          with one click.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {keyFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.4 }}
              className="flex flex-col items-center gap-5 p-5 md:p-10 rounded-[20px] shadow-[0px_4px_14px_0px_#D7C4B666] hover:shadow-[0px_28px_34px_0px_#D7C4B666] transition-shadow"
            >
              <img src={item.icon} className="h-auto mb-2" alt={item.title} />
              <h3 className="text-2xl font-semibold text-secondary text-center">
                {item.title}
              </h3>
              <p className="text-body text-center text-secondary">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Request a Demo */}
      <section className="px-4 scroll-mt-20" id="request-demo">
        <div className="max-w-[1725px] mx-auto mb-10 bg-coffee-bg rounded-[30px] p-5 md:p-10">
          <h2 className="text-h2 mb-3 md:mb-6 text-center text-primary-foreground">
            Request a Demo
          </h2>
          <p className="text-[#BEA998] text-body text-center max-w-2xl mx-auto mb-6 md:mb-10">
            Discover how our solution works for your needs. Fill in your details
            to schedule a personalized demo and explore the features firsthand.
          </p>
          <form action="" className="max-w-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 *:!rounded-[8px] *:placeholder:text-coffee-bg-foreground *:h-12 *:!border-[#977466] *:text-white">
              <Input
                className="bg-transparent"
                placeholder="Name"
                label="Name"
                required
              />
              {/* <Input className="" placeholder="State" label="State" required /> */}
              {/* <Select>
                  <SelectTrigger className="w-full !h-12 data-[placeholder]:!text-coffee-bg-foreground [&_svg]:!text-coffee-bg-foreground">
                    <SelectValue placeholder="State" className="" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      pennsylvaniaCities.map((item, index) => (
                        <SelectItem key={index} value={item}>{item}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select> */}
              <Input
                className="bg-transparent"
                placeholder="State"
                label="State"
                type="text"
                required
              />
              <Input
                className="bg-transparent"
                placeholder="Email"
                label="Email"
                type="email"
                required
              />
              <Input
                className="bg-transparent"
                placeholder="Country"
                label="Country"
                type="text"
                required
              />
              <Textarea
                className="sm:col-span-2 placeholder:!text-[#A78B7F] placeholder:italic"
                placeholder="Enter additional info here..."
                label="Message"
                required
              />
            </div>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="text-tertiary bg-coffee-bg-foreground hover:bg-coffee-bg-foreground/90 hover:scale-105"
              >
                Submit <ArrowRight />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Back to Top */}
      <div
        className={`fixed bottom-2 right-2 z-10 flex items-center gap-2 p-3 text-secondary pt-8 hover:opacity-100 ${
          showBackToTop ? "opacity-40" : "opacity-0"
        } transition-all `}
      >
        <p className="hidden md:block">Back to top</p>
        <Button
          size="icon"
          className="size-10"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp />
        </Button>
      </div>

      {/* Report Dialog */}
      <Dialog open={openReportDialog} onOpenChange={setOpenReportDialog}>
        <DialogContent className="!max-w-5xl w-full max-h-[90vh] flex flex-col !px-2 border-8 border-[#EADDD0] rounded-4xl">
          <DialogHeader className="px-3 md:px-5">
            <div className="flex items-center justify-center pb-4  border-b-[1px] border-[#E8D0A7]">
              <img
                src="/Logo.svg"
                className="w-14 md:w-16 absolute left-4 md:left-6 mr-8"
                alt="Title Munke Logo"
              />
              <DialogTitle className="text-center text-lg md:text-[28px] font-semibold">
                {/* <h4 className="text-center text-lg md:text-[28px] font-semibold"  >
                </h4> */}
                Sample Report Breakdown
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="grid sm:grid-cols-2 gap-8 h-full overflow-auto px-3 md:px-5">
            <div className="space-y-6">
              <img
                src="/report-map.jpg"
                alt="map highlight"
                className="max-md:w-full  md:mb-5"
              />
              <img
                src="/report-mansion.jpg"
                alt="mansion"
                className="max-md:w-full  md:mb-12"
              />
              <ListForReport
                title="Easements / Restrictions"
                items={[
                  { label: "", value: "Utility access easement (2020)" },
                  { label: "Drainage restriction (2019)", value: "" },
                  {
                    label: "Why it matters:",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in tyreyu maximus augue.",
                  },
                ]}
              />
              <ListForReport
                title="Civil Records Check"
                items={[
                  { label: "", value: "No judgments or liens found " },
                  { label: "Drainage restriction (2019)", value: "" },
                  {
                    label: "Why it matters:",
                    value: "Lorem ipsum dolor sit amet, consectetut.",
                  },
                ]}
              />
            </div>
            <div className="space-y-6">
              <ListForReport
                title={"Property Information"}
                items={[
                  {
                    label: "Address",
                    value: "1457 Elmwood Avenue, Springfield, IL 62704",
                  },
                  { label: "Parcel Identifier", value: "09-23-456-001" },
                  { label: "Jurisdiction", value: "Sangamon County" },
                  {
                    label: "Why it matters",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in maximu.",
                  },
                ]}
              />
              <ListForReport
                title={"Current Owner & Deed"}
                items={[
                  { label: "Owner", value: "Greenfield Holdings LLC" },
                  { label: "Deed recorded", value: "2022" },
                  {
                    label: "Why it matters",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in maximus",
                  },
                ]}
              />
              <ListForReport
                title={"Mortgages"}
                items={[
                  {
                    value: (
                      <span>
                        <strong>$325,000</strong>, First National Bank
                      </span>
                    ),
                  },
                  {
                    value: (
                      <span>
                        <strong>$780,500</strong>, Springfield Trust Bank
                      </span>
                    ),
                  },
                  {
                    label: "Why it matters",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in maximus",
                  },
                ]}
              />
              <ListForReport
                title={"Legal Description"}
                items={[
                  { value: "Full metes-and-bounds description text here..." },
                  {
                    label: "Why it matters",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in maximus augue.",
                  },
                ]}
              />
              <ListForReport
                title={"All Source Documents Collected"}
                items={[
                  { value: "Deeds, Mortgages, Easements, Legal Docs" },
                  {
                    label: "Why it matters",
                    value: "Lorem ipsum dolor sit amet, consectetur.",
                  },
                ]}
              />
            </div>
          </div>
          {/* <DialogTitle className="text-center text-[28px]" >Sample Report Breakdown</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription> */}
          <DialogFooter>
            <div className="mt-1 flex justify-center gap-4 w-full">
              <Button className="hover:scale-105" size="lg">
                Download Now
              </Button>
              <Button
                variant="outline"
                className="outline-primary border-primary text-primary hover:scale-105 "
                size="lg"
                onClick={() => setOpenReportDialog(false)}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ListForReport({ title, items, titleClass, listClass, containerClass }) {
  return (
    <div className={cn(containerClass)} >
      <p
        className={cn(
          "text-lg md:text-[22px] mb-2 font-semibold text-secondary ",
          titleClass
        )}
      >
        {title}
      </p>
      <ul className="space-y-1 md:space-y-2 !list-disc list-outside *:ml-5 *:text-secondary">
        {items.map((item, index) => (
          <li key={index} className={cn(listClass)}>
            {item.label && <strong>{item.label}</strong>}
            {item.value && <span>{item.value}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
