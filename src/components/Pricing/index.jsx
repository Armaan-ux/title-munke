import Navbar from "../Home/navbar";
import { ArrowRight, MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { FormValidationError } from "../common/FormValidationError";
import Footer from "../Home/footer";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { motion } from "motion/react";
import { useState } from "react";
import { demoRequestSchema } from "@/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { demoRequest } from "../service/userAdmin";
import { toast } from "react-toastify";
import "./index.css";
import { flexiblePricing, pricingPlansBroker, pricingPlansIndividual, pricingPlansOrganization } from "@/utils/constant";
const defaultDemoData = {
  name: "",
  state: "",
  email: "",
  country: "",
  additionalMessage: "",
};
const Pricing = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("PROFESSIONAL_PLAN");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultDemoData,
    resolver: zodResolver(demoRequestSchema),
  });
  const demoReqMutation = useMutation({
    mutationFn: (payload) => demoRequest(payload),
    onSuccess: () => {
      reset();
      toast.success("Request submitted successfully");
    },
    onError: () => {
      toast.error("Request submission failed");
    },
  });

  const pricingPlansMap = {
    agent: pricingPlansIndividual,
    broker: pricingPlansBroker,
    organization: pricingPlansOrganization,
  };
  const PricingCard = ({
    title,
    description,
    price,
    priceSuffix,
    recommended = false,
  }) => {
    return (
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-[linear-gradient(314deg,_#f5c66a,_#fff6e4)] p-6 shadow-sm z-[1] relative">
          {/* Recommended ribbon */}
          {recommended && (
            <div className="card-info-parent">
              <div className="card-info">
                <p className="text-[11px] font-semibold tracking-wide text-white">
                  RECOMMENDED
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="text-2xl font-semibold text-secondary font-poppins">
              {title}
            </div>

            <p className="mt-2 text-sm leading-5 text-[#554536]">
              {description}
            </p>
          </div>

          <div className="mt-6 flex items-end">
            <span className="text-3xl font-extrabold text-[#550000]">
              {price}
            </span>

            {priceSuffix && (
              <span className="ml-2 mb-1 text-sm text-[#977128]">
                {priceSuffix}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  const activePricingPlans =
    pricingPlansMap[userType] || pricingPlansIndividual;
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

      {userType === null && (
        <section className="bg-gradient-to-t from-[#FFFFFF] to-[#FFF8EB] py-20">
          <div className="max-w-[1280px] mx-auto px-4">
            <h2 className="text-h2 text-center text-secondary mb-6">
              Flexible Pricing for Every Scale
            </h2>
            <p className="text-center max-w-[1000px] mx-auto mb-10 text-body text-coffee-light">
              Whether you're an individual agent or an enterprise operation,
              Title Munke offers transparent pricing designed to grow with your
              business.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {flexiblePricing.map((item, index) => (
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
                  style={{
                    backgroundImage: `url(${item.background})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top",
                    backgroundSize: "100% 130px",
                  }}
                  className="flex flex-col items-center bg-white p-5 md:p-10 rounded-[20px] border-3 border-[#E8D0A7] shadow-[0px_4px_14px_0px_#D7C4B666] hover:shadow-[0px_28px_34px_0px_#D7C4B666] transition-shadow"
                >
                  <img
                    src={item.icon}
                    className="h-auto mb-5"
                    alt={item.title}
                  />
                  <div className="text-2xl font-semibold text-secondary text-center mb-0">
                    {item.title}
                  </div>
                  <p className="text-center text-secondary">{item.subTitle}</p>

                  <img
                    src="/divider.png"
                    className="h-auto my-4"
                    alt="divider"
                  />

                  <div className="text-xl font-semibold text-secondary text-left w-full mb-4">
                    {item.headline}
                  </div>
                  <p className="text-secondary leading-relaxed">
                    {item.content}
                  </p>

                  <div className="mt-auto pt-8 w-full">
                    <Button
                      className="hover:scale-105 w-full bg-[#5D4135] hover:bg-[#5D4135]"
                      size="lg"
                      onClick={() => setUserType(item.key)}
                    >
                      Know More <MoveRight />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Flexible Pricing for Every Scale */}
      {userType !== null && (
        <section className="bg-gradient-to-t from-[#FFFFFF] to-[#FFF8EB] py-20">
          <div className="max-w-[1280px] mx-auto px-4">
            <h2 className="text-h2 text-center text-secondary mb-6">
              {userType === "broker"
                ? "Brokerage Options"
                : userType === "organization"
                  ? "Organization Solutions"
                  : "Individual Agent"}
            </h2>
            <p className="text-center max-w-[1000px] mx-auto mb-10 text-body text-coffee-light">
              {userType === "broker"
                ? `Scalable plans built for brokers managing teams, higher volume, and faster turnaround requirements.
`
                : userType === "organization"
                  ? `Powerful, customizable solutions built for large organizations, investors, and enterprise-scale operations.`
                  : `Choose how you want to use Title Munke. Explore the platform, become
            a member, or pay only when you need a report.`}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {activePricingPlans.map((plan, index) => {
                const isSelected = selectedPlan === plan.id;
                return (
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
                    className={`flex flex-col items-center bg-white p-1 md:p-5 rounded-[20px] border-3  ${isSelected ? "border-[#5D4135]" : "border-[#E8D0A7]"} shadow-[0px_4px_14px_0px_#D7C4B666] hover:shadow-[0px_28px_34px_0px_#D7C4B666] transition-shadow h-fit`}
                  >
                    <PricingCard
                      title={plan.title}
                      description={plan.description}
                      price={plan.price}
                      priceSuffix={plan.subtitle}
                      recommended={plan.recommended}
                    />
                    <div className="bg-white rounded-b-[20px] px-6 pt-8  flex flex-col h-full">
                      <ul className="space-y-4 pb-4">
                        {plan.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-sm text-secondary"
                          >
                            <img
                              src="/checkbox.png"
                              className="h-5 w-5"
                              alt="checkbox"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {plan.note && (
                        <p className="text-xs text-coffee-light mb-4">
                          <span className="font-semibold">Note:</span>{" "}
                          {plan.note}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto pt-8 w-full">
                      <Button
                        className="hover:scale-105 w-full bg-[#5D4135] hover:bg-[#5D4135]"
                        size="lg"
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          navigate(`/subscription-signup/${userType}/${plan.id}`);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
          <form
            onSubmit={handleSubmit((data) => demoReqMutation.mutate(data))}
            className="max-w-xl mx-auto"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Name"
                      label="Name"
                      className="bg-transparent !rounded-[8px] placeholder:text-coffee-bg-foreground h-12 *:!border-[#977466] text-white"
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <FormValidationError
                    message={errors.name.message}
                    color={"text-[#e09a9d]"}
                  />
                )}
              </div>
              {/* <Input
                className="bg-transparent"
                placeholder="Name"
                label="Name"
                required
                value={demoData.name}
                onChange={(e) => setDemoData(pre => ({...pre, name: e.target.value}))}
              /> */}
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
              <div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Email/Phone"
                      label="Email/Phone"
                      className="bg-transparent !rounded-[8px] placeholder:text-coffee-bg-foreground h-12 *:!border-[#977466] text-white"
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <FormValidationError
                    message={errors.email.message}
                    color={"text-[#e09a9d]"}
                  />
                )}
              </div>
              <div>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="State"
                      label="State"
                      className="bg-transparent !rounded-[8px] placeholder:text-coffee-bg-foreground h-12 *:!border-[#977466] text-white"
                      {...field}
                    />
                  )}
                />
                {errors.state && (
                  <FormValidationError
                    message={errors.state.message}
                    color={"text-[#e09a9d]"}
                  />
                )}
              </div>
              {/* <Input
                className="bg-transparent"
                placeholder="State"
                label="State"
                type="text"
                required
                value={demoData.state}
                onChange={(e) => setDemoData(pre => ({...pre, state: e.target.value}))}
              /> */}
              {/* <Input
                className="bg-transparent"
                placeholder="Email/Phone"
                label="Email"
                type={Number(demoData.email) ? "text" : "email"}
                required
                value={demoData.email}
                onChange={(e) => setDemoData(pre => ({...pre, email: e.target.value}))}
              /> */}
              <div>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="County"
                      label="County"
                      className="bg-transparent !rounded-[8px] placeholder:text-coffee-bg-foreground h-12 *:!border-[#977466] text-white"
                      {...field}
                    />
                  )}
                />
                {errors.country && (
                  <FormValidationError
                    message={errors.country.message}
                    color={"text-[#e09a9d]"}
                  />
                )}
              </div>
              {/* <Input
                className="bg-transparent"
                placeholder="County"
                label="Country"
                type="text"
                required
                value={demoData.country}
                onChange={(e) => setDemoData(pre => ({...pre, country: e.target.value}))}
              /> */}
              <div className="sm:col-span-2">
                <Controller
                  className="w-full"
                  name="additionalMessage"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      placeholder="Enter additional info here..."
                      label="Message"
                      className="bg-transparent !rounded-[8px] h-12 *:!border-[#977466] text-white placeholder:!text-[#A78B7F] placeholder:italic"
                      {...field}
                    />
                  )}
                />
              </div>
              {/* <Textarea
                className="sm:col-span-2 placeholder:!text-[#A78B7F] placeholder:italic"
                placeholder="Enter additional info here..."
                label="Message"
                required
                value={demoData.additionalMessage}
                onChange={(e) => setDemoData(pre => ({...pre, additionalMessage: e.target.value}))}
              /> */}
            </div>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="text-tertiary bg-coffee-bg-foreground hover:bg-coffee-bg-foreground/90 hover:scale-105"
                disabled={demoReqMutation.isPending}
              >
                {" "}
                {demoReqMutation.isPending ? "Submitting..." : "Submit"}
                <ArrowRight />
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pricing;
