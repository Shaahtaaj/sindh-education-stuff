"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode="login"|"register";

export function CustomerAuthForm({mode}:{mode:Mode}){
  const router=useRouter();
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setError("");setLoading(true);
    const payload=Object.fromEntries(new FormData(event.currentTarget));
    try{
      const response=await fetch(`/api/portal/auth/${mode}`,{
        method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)
      });
      const body=await response.json();
      if(!response.ok)throw new Error(body.error??"Unable to continue.");
      router.push("/portal/dashboard");router.refresh();
    }catch(problem){
      setError(problem instanceof Error?problem.message:"Unable to continue.");
    }finally{setLoading(false)}
  }

  const field="focus-ring w-full rounded-xl border border-[#d7e0e7] bg-white px-4 py-3.5 text-sm text-[#0b1f3a] placeholder:text-[#8a97a6]";
  return <form onSubmit={submit} className="mt-8 grid gap-4">
    {mode==="register"?<input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"/>:null}
    {mode==="register"?<><label className="grid gap-2 text-sm font-bold text-[#26374d]">Full name<input name="name" autoComplete="name" required minLength={2} className={field}/></label><label className="grid gap-2 text-sm font-bold text-[#26374d]">WhatsApp number<input name="phone" autoComplete="tel" required placeholder="+92…" className={field}/></label></>:null}
    <label className="grid gap-2 text-sm font-bold text-[#26374d]">Email address<input name="email" type="email" autoComplete="email" required className={field}/></label>
    <label className="grid gap-2 text-sm font-bold text-[#26374d]">Password<input name="password" type="password" autoComplete={mode==="login"?"current-password":"new-password"} required minLength={8} className={field}/></label>
    {error?<p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>:null}
    <button disabled={loading} className="mt-2 rounded-xl bg-[#0b6b42] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#075332] disabled:opacity-60">{loading?"Please wait…":mode==="login"?"Sign in":"Create account"}</button>
    <p className="text-center text-sm text-[#667589]">{mode==="login"?"New customer?":"Already registered?"} <Link className="font-bold text-[#0b6b42]" href={mode==="login"?"/portal/register":"/portal/login"}>{mode==="login"?"Create an account":"Sign in"}</Link></p>
  </form>;
}
