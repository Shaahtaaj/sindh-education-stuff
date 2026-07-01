"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { programs } from "@/lib/constants";

const services=["Assignment guidance","Formatting and typing","Research 8613 guidance","Lesson plan support","Teaching practice support","Review and feedback"];

export function RequestForm(){
  const router=useRouter();const [loading,setLoading]=useState(false);const [error,setError]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setLoading(true);setError("");
    const payload=Object.fromEntries(new FormData(event.currentTarget));
    try{
      const response=await fetch("/api/portal/requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const body=await response.json();if(!response.ok)throw new Error(body.error??"Unable to submit request.");
      router.push(`/portal/requests/${body.id}`);router.refresh();
    }catch(problem){setError(problem instanceof Error?problem.message:"Unable to submit request.")}finally{setLoading(false)}
  }
  const field="focus-ring w-full rounded-xl border border-[#d7e0e7] bg-white px-4 py-3.5 text-sm text-[#0b1f3a]";
  return <form onSubmit={submit} className="mt-7 grid gap-5 rounded-2xl border border-[#dfe5e2] bg-white p-5 shadow-[0_8px_30px_rgba(11,31,58,.04)] md:grid-cols-2 md:p-7">
    <label className="grid gap-2 text-sm font-bold text-[#26374d]">Program<select name="program" required className={field}><option value="">Select program</option>{programs.map(value=><option key={value}>{value}</option>)}</select></label>
    <label className="grid gap-2 text-sm font-bold text-[#26374d]">Course code<input name="courseCode" required placeholder="Example: 8612" className={field}/></label>
    <label className="grid gap-2 text-sm font-bold text-[#26374d]">Support type<select name="serviceType" required className={field}><option value="">Select support type</option>{services.map(value=><option key={value}>{value}</option>)}</select></label>
    <label className="grid gap-2 text-sm font-bold text-[#26374d]">Deadline<input name="deadline" type="date" required min={new Date().toISOString().slice(0,10)} className={field}/></label>
    <label className="grid gap-2 text-sm font-bold text-[#26374d] md:col-span-2">What help do you need?<textarea name="message" required minLength={10} rows={7} placeholder="Describe the task, requirements and the kind of guidance you need." className={`${field} resize-y leading-6`}/></label>
    <div className="md:col-span-2"><div className="rounded-xl bg-[#f4f7f6] p-4 text-xs leading-6 text-[#607086]">Submit your own instructions and reference details. We provide guidance, formatting, tutoring and review support; students remain responsible for their original academic work.</div>{error?<p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>:null}<div className="mt-5 flex justify-end"><button disabled={loading} className="rounded-xl bg-[#0b6b42] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#075332] disabled:opacity-60">{loading?"Submitting…":"Submit request"}</button></div></div>
  </form>;
}
