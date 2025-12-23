import { useEffect, useRef, useState } from "react";
import { Maximize2, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { ChatService } from "../service/chat";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useOnClickOutside } from 'usehooks-ts'
const userKeys = {
  individual: "user_id",
  agent: "agent_id",
  broker: "broker_id",
}
const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [isIncreaseSize, setIsIncreaseSize] = useState(false);
  const outsideRef = useRef(null);
  const {userId, userType} = useUserIdType()
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi 👋 I'm your AI Property Assistant! Type an address, PIN, or question below to begin your search.",
    },
  ]);
  const chatMutation = useMutation({
    mutationFn: (payload) => ChatService(payload),
    onSuccess: (data) => {
      setMessages(pre => ([...pre, {from: "bot", text: data?.answer, source: data?.source_file_url}]))
      console.log(data)
    }
  })
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    chatMutation.mutate({
      action: "query",
      question: input,
      [userKeys[userType]]: userId,
      userType,
      "top_k": 5
    })
    setInput("");
    try {
      // const { data } = await axios.post(
      //   "https://title-munke-4.onrender.com/ask",
      //   // "https://fq2vt0j2-8000.inc1.devtunnels.ms/ask",
      //   { question: input },
      //   { headers: { "Content-Type": "application/json" } }
      // );
      // console.log("Chatbot response data:", data);

      // const botReply =
      //   data?.answer ||
      //   "Sorry, I couldn’t get a response right now. Please try again.";

      // setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ There was a problem reaching the server. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  useOnClickOutside(outsideRef, () => setOpen(false))
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className={`w-80 ${isIncreaseSize ? "md:w-120" : "md:w-96"} bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-4 duration-300`} ref={outsideRef}>
          <div className="bg-[#5C1F0E] text-white px-4 py-3 flex justify-between items-center">
            <p className="font-semibold">Munke Assist</p>
            <div className="flex gap-2.5 items-center">
              <button onClick={() => setIsIncreaseSize(pre => !pre)}>
                <Maximize2 className="w-5 h-5"/>
              </button>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`p-4 space-y-3 ${isIncreaseSize ? "max-h-96" : "max-h-80"} overflow-y-auto`}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${msg.from === "bot" ? "flex-col items-start" : "flex-row"} ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >

                <div
                  className={`rounded-2xl px-3 py-2 text-sm max-w-[75%] ${
                    msg.from === "user"
                      ? "bg-[#5C1F0E] text-white"
                      : "bg-[#F5F0EC] text-gray-700"
                  }`}
                >
                  {msg.from === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-[#FFF0E4] flex items-center justify-center shrink-0">
                    <img
                      src="/chat-avatar.svg"
                      alt="Bot"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </div>
                )}
                  {msg.text}
                </div>

                {msg.from === "user" && <div className="w-8" />}
                {/* <div className="flex flex-col gap-2.5 overflow-x-auto">
                  {msg?.from === "bot" &&
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={msg?.source}
                        className="break-all whitespace-normal text-blue-600 underline"
                      >
                        {msg?.source}
                      </a>
                    }
                </div> */}
              </div>
            ))}

            {chatMutation?.isPending && (
              <div className="flex space-x-1 text-gray-500 text-sm italic justify-end">
                <span className="animate-bounce">.</span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                >
                  .
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                >
                  .
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 flex items-center gap-2 p-3">
            <Input
              placeholder="Type here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-sm bg-white"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              onClick={handleSend}
              className="bg-[#5C1F0E] text-white hover:bg-[#4b180b]"
              disabled={chatMutation?.isPending}
            >
              Send
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full w-14 h-14 bg-[#5C1F0E] hover:bg-[#4b180b] shadow-lg"
      >
        <img src="/chat-bot.svg" alt="Bot" className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default AIChatBot;
