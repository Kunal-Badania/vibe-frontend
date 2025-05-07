"use client";
import Image from "next/image";
import Blur from "@/components/Blur";
import HomeFooter from "@/components/common/HomeFooter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import React, { useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import useDebounce from "@/Hooks/useDebounce";
import Login from "@/components/common/Login";
import Link from "next/link";
function Page() {
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const roomNameRef = useRef<AbortController | null>(null);
  const checkRoom = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const roomName = e.target.value;
    setError(null);
    const isValidRoomId = /^[a-zA-Z0-9]+$/.test(roomName);

    if (roomName.trim().length == 0) return;
    if (roomName.length <= 3) {
      setError("Name is too short, minimum 4 characters");
      return;
    }

    if (roomName.length > 11) {
      setError("Name is too large, maximum 11 characters");
      return;
    }
    if (!isValidRoomId) {
      setError("Special characters not allowed");
      return;
    }
    setLoader(true);
    if (roomNameRef.current) {
      roomNameRef.current.abort();
    }
    const controller = new AbortController();
    roomNameRef.current = controller;
    const res = await api.get(
      `${process.env.SOCKET_URI}/api/checkroom?r=${roomName}`,
      {
        showErrorToast: false,
        signal: controller.signal,
      }
    );
    setLoader(false);
    if (res.error) {
      setError(res?.error);
    }
  };
  const makeRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const isValidRoomId = /^[a-zA-Z0-9]+$/.test(roomName);

    if (roomName.trim().length == 0) return;
    if (roomName.length <= 3) {
      setError("Name is too short, minimum 4 characters");
      return;
    }

    if (roomName.length > 11) {
      setError("Name is too large, maximum 11 characters");
      return;
    }
    if (!isValidRoomId) {
      setError("Special characters not allowed");
      return;
    }
    setLoader(true);
    if (roomNameRef.current) {
      roomNameRef.current.abort();
    }
    const controller = new AbortController();
    roomNameRef.current = controller;
    const res = await api.get(
      `${process.env.SOCKET_URI}/api/checkroom?r=${roomName}`,
      { showErrorToast: false, signal: controller.signal }
    );
    if (res.success) {
      window.location.href = `/${roomName}`;
      setLoader(false);
      return;
    }
    setLoader(false);
    if (res.error) {
      setError(res?.error);
    }
  };
  const handleCheckRoom = useDebounce(checkRoom, 200);
  return (
    <main className="  bg-[url('/mask.svg')] bg-no-repeat bg-cover ">
      <Blur className=" blur-2xl bg-transparent" />
      <motion.div
        initial={{
          opacity: 0,
          filter: "blur(10px)",
        }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.75,
        }}
        exit={{ opacity: 0 }}
        className=" min-h-dvh md:pb-[10dvh] min-w-dvw flex items-center justify-center flex-col bg-[url('/mask.svg')] bg-cover"
      >
        <div className="   w-8/12 max-xl:w-11/12 max-sm:w-full  max-lg:w-11/12 max-md:w-full flex max-md:gap-2 max-md:pt-8 justify-center flex-wrap items-center max-md:px-5">
          <div className=" w-1/2 max-md:text-center max-md:w-full flex font-semibold gap-4 flex-col max-md:justify-center max-md:items-center">
            <Image
              src={"/logo.svg"}
              className=" ml-1 size-16 max-md:size-20"
              alt="logo"
              height={80}
              width={80}
            />
            <p className=" text-6xl max-md:text-5xl -mt-3">
              Friends<br />
              Music & Fun
            </p>
            <p className=" -mt-4 text-5xl max-md:text-5xl italic text-with-image">
              Start Here.
            </p>
            <span className="ml-1 max-md:hidden font-normal text-lg leading-snug my-2.5 -mt-1 mb-1">
              Invite friends, enjoy high quality music
              <br /> & Vibe together over millions of songs.🥂.
            </span>
            <span className="ml-1 max-md:flex hidden font-normal text-lg leading-tight my-2.5 -mt-1 mb-1">
              Invite friends, enjoy high quality music & let votes decide the
              beat🥂.
            </span>

            <form
              onSubmit={makeRoom}
              className="max-w-[340px] hidden h-auto pl-3 pr-1.5 py-1.5 bg-[#c8aeff]/0 rounded-xl border border-[#eaddff]/50 justify-between items-center "
            >
              <div className="flex items-center relative">
                <div
                  className={` ${
                    roomName.length == 0 ? "text-white" : "text-white/60"
                  } transition-all duration-150  text-sm font-semibold leading-tight tracking-tight`}
                >
                  getvibe.in/
                </div>
                <input
                  min={4}
                  autoFocus
                  maxLength={11}
                  max={11}
                  value={roomName}
                  onInput={(e) => setRoomName(e.currentTarget.value)}
                  onChange={handleCheckRoom}
                  placeholder="enter party name"
                  className="placeholder:animate-pulse placeholder:opacity-55 bg-transparent outline-none top-0  text-white text-sm font-medium leading-tight tracking-tight"
                />
              </div>
              <Button
                disabled={loader || typeof error === "string"}
                type="submit"
                className=" bg-white rounded-lg flex-col justify-center items-center gap-2"
              >
                {loader ? <LoaderCircle className=" animate-spin" /> : "Claim"}
              </Button>
            </form>
            <Link href={"/v"} className="w-full md:w-fit">
              <Button size={"lg"} className=" w-full py-5 text-lg">
                Start Listening
              </Button>
            </Link>
            <p className="h-2 text-red-500 font-normal text-xs -mt-2 px-1">
              {error}
            </p>
            <Login footer />
          </div>
          <div className=" w-1/2  max-md:w-full">
            <video
              preload="true"
              playsInline
              src="https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/Vibe_Opt.mp4"
              className=" rounded-xl"
              muted
              loop
              autoPlay
            />
          </div>
        </div>
        <HomeFooter />
      </motion.div>
    </main>
  );
}

export default Page;
