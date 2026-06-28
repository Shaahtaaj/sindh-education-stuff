"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check, ChevronDown, Download, Edit3, Eye, FileArchive, FileImage,
  FileText, Filter, MoreHorizontal, Plus, Search, Trash2, UploadCloud, X
} from "lucide-react";

type MaterialRecord = {
  id: string; title: string; slug: string; program: string; course: string;
  semester: string; category: string; type: string; language: string;
  access: "Free" | "Paid"; price: string; status: "Draft" | "Published";
  description: string; content: string; tags: string; seoTitle: string;
  metaDescription: string; fileUrl: string; fileName: string;
  thumbnailUrl: string; updatedAt: string; downloads: number;
};

const categories = ["Assignments","Research 8613","Lesson Plans","Field Notes","Guess Papers","Assignment Dates","Tutor Guide","Notes"];
const types = ["Assignment guide","Research guide","Lesson plan","Field note","Guess paper","Notes","General guide"];
const languages = ["English","Urdu","Sindhi","Bilingual"];
const initialRecords: MaterialRecord[] = [];

const emptyRecord = (): MaterialRecord => ({
  id:"",title:"",slug:"",program:"",course:"",semester:"",
  category:"Assignments",type:"Assignment guide",language:"English",access:"Free",
  price:"0",status:"Draft",description:"",content:"",tags:"",seoTitle:"",
  metaDescription:"",fileUrl:"",fileName:"",thumbnailUrl:"",
  updatedAt:new Intl.DateTimeFormat("en-PK",{day:"numeric",month:"short",year:"numeric"}).format(new Date()),downloads:0
});

function SelectField({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:string[]}) {
  return <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.06em] text-[#53657a]">{label}<span className="relative"><select value={value} onChange={event=>onChange(event.target.value)} className="focus-ring w-full appearance-none rounded-xl border border-[#d7e0e7] bg-white px-4 py-3 pr-10 text-sm font-semibold normal-case tracking-normal text-[#0b1f3a]"><option value="">Select {label.toLowerCase()}</option>{options.map(option=><option key={option}>{option}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8999]"/></span></label>;
}

function TextField({label,value,onChange,placeholder,required=true,type="text"}:{label:string;value:string;onChange:(value:string)=>void;placeholder?:string;required?:boolean;type?:string}) {
  return <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.06em] text-[#53657a]">{label}<input type={type} required={required} value={value} onChange={event=>onChange(event.target.value)} placeholder={placeholder} className="focus-ring rounded-xl border border-[#d7e0e7] bg-white px-4 py-3 text-sm font-medium normal-case tracking-normal text-[#0b1f3a] placeholder:font-normal placeholder:text-[#9aa6b3]"/></label>;
}

function DropField({label,accept,file,onFile,existingName,kind}:{label:string;accept:string;file:File|null;onFile:(file:File|null)=>void;existingName?:string;kind:"document"|"image"}) {
  const input=useRef<HTMLInputElement>(null);
  const [dragging,setDragging]=useState(false);
  const name=file?.name||existingName;
  const Icon=kind==="image"?FileImage:FileArchive;
  return <div><p className="mb-2 text-xs font-extrabold uppercase tracking-[.06em] text-[#53657a]">{label}</p><button type="button" onClick={()=>input.current?.click()} onDragOver={event=>{event.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={event=>{event.preventDefault();setDragging(false);onFile(event.dataTransfer.files[0]??null)}} className={`flex w-full items-center gap-4 rounded-2xl border-2 border-dashed p-5 text-left transition ${dragging?"border-[#147a4b] bg-[#eaf6ef]":"border-[#cfd9e1] bg-[#f8fafb] hover:border-[#92bda3] hover:bg-[#f3f9f5]"}`}><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#147a4b] shadow-sm">{name?<Icon size={21}/>:<UploadCloud size={21}/>}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#0b1f3a]">{name||`Drop ${kind==="image"?"an image":"a file"} here or browse`}</span><span className="mt-1 block text-xs text-[#718094]">{kind==="image"?"PNG or JPG · max 5 MB":"PDF, DOC, DOCX, PNG or JPG · max 5 MB"}</span></span>{name?<span onClick={event=>{event.stopPropagation();onFile(null)}} className="grid size-8 place-items-center rounded-lg text-[#8a5960] hover:bg-red-50"><X size={16}/></span>:null}<input ref={input} className="hidden" type="file" accept={accept} onChange={event=>onFile(event.target.files?.[0]??null)}/></button></div>;
}

async function uploadFile(file:File|null) {
  if(!file)return "";
  if(file.size>5*1024*1024)throw new Error(`${file.name} exceeds the 5 MB limit.`);
  const body=new FormData();body.set("file",file);
  const response=await fetch("/api/uploads",{method:"POST",body});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error??`Unable to upload ${file.name}.`);
  return result.url as string;
}

export function MaterialStudio() {
  const [records,setRecords]=useState(initialRecords);
  const [loading,setLoading]=useState(true);
  const [editor,setEditor]=useState(false);
  const [draft,setDraft]=useState<MaterialRecord>(emptyRecord);
  const [documentFile,setDocumentFile]=useState<File|null>(null);
  const [thumbnailFile,setThumbnailFile]=useState<File|null>(null);
  const [query,setQuery]=useState("");
  const [statusFilter,setStatusFilter]=useState("All");
  const [categoryFilter,setCategoryFilter]=useState("All");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [programs,setPrograms]=useState<string[]>([]);
  const [courseRecords,setCourseRecords]=useState<{code:string;name:string;program:string;semester:string;status:string}[]>([]);
  const [semesters,setSemesters]=useState<string[]>([]);

  useEffect(()=>{let active=true;async function load(){const responses=await Promise.all(["/api/admin/materials","/api/admin/programs","/api/admin/courses","/api/admin/semesters"].map(url=>fetch(url,{cache:"no-store"})));const bodies=await Promise.all(responses.map(response=>response.json()));if(!active)return;if(responses[0].ok)setRecords(bodies[0] as MaterialRecord[]);else setError(bodies[0].error??"Unable to load materials.");setPrograms((bodies[1] as {values:string[]}[]).map(row=>row.values[0]).filter(Boolean));setCourseRecords((bodies[2] as {values:string[]}[]).map(row=>({code:row.values[0]??"",name:row.values[1]??"",program:row.values[2]??"",semester:row.values[3]??"",status:row.values[4]??""})).filter(course=>course.code&&course.status!=="Inactive"));setSemesters((bodies[3] as {values:string[]}[]).map(row=>row.values[0]).filter(Boolean));setLoading(false)}void load();return()=>{active=false}},[]);
  const availableCourses=useMemo(()=>courseRecords.filter(course=>(!draft.program||course.program===draft.program)&&(!draft.semester||course.semester===draft.semester)).map(course=>`${course.code} — ${course.name}`),[courseRecords,draft.program,draft.semester]);

  const filtered=useMemo(()=>records.filter(record=>{
    const matchesQuery=`${record.title} ${record.course} ${record.tags}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery&&(statusFilter==="All"||record.status===statusFilter)&&(categoryFilter==="All"||record.category===categoryFilter);
  }),[records,query,statusFilter,categoryFilter]);

  function update<K extends keyof MaterialRecord>(key:K,value:MaterialRecord[K]){setDraft(current=>({...current,[key]:value}))}
  function openNew(){const record=emptyRecord();record.program=programs[0]??"";record.semester=semesters[0]??"";const firstCourse=courseRecords.find(course=>(!record.program||course.program===record.program)&&(!record.semester||course.semester===record.semester));record.course=firstCourse?`${firstCourse.code} — ${firstCourse.name}`:"";setDraft(record);setDocumentFile(null);setThumbnailFile(null);setError("");setEditor(true)}
  function openEdit(record:MaterialRecord){setDraft({...record});setDocumentFile(null);setThumbnailFile(null);setError("");setEditor(true)}
  async function remove(record:MaterialRecord){if(!window.confirm(`Delete “${record.title}”?`))return;const response=await fetch(`/api/admin/materials?id=${encodeURIComponent(record.id)}`,{method:"DELETE"});if(!response.ok){const body=await response.json();setError(body.error??"Unable to delete material.");return}setRecords(current=>current.filter(item=>item.id!==record.id));setNotice("Material deleted.")}

  async function save(event:React.FormEvent){
    event.preventDefault();setError("");
    if(!draft.title.trim()||!draft.slug.trim()||!draft.description.trim()){setError("Title, slug and description are required.");return}
    if(draft.access==="Paid"&&Number(draft.price)<=0){setError("Enter a valid price for paid material.");return}
    setSaving(true);
    try{
      const [newFileUrl,newThumbnailUrl]=await Promise.all([uploadFile(documentFile),uploadFile(thumbnailFile)]);
      const saved={...draft,id:draft.id||crypto.randomUUID(),fileUrl:newFileUrl||draft.fileUrl,fileName:documentFile?.name||draft.fileName,thumbnailUrl:newThumbnailUrl||draft.thumbnailUrl,updatedAt:new Intl.DateTimeFormat("en-PK",{day:"numeric",month:"short",year:"numeric"}).format(new Date())};
      const response=await fetch("/api/admin/materials",{method:draft.id?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(saved)});
      const body=await response.json();if(!response.ok)throw new Error(body.error??"Unable to save material.");
      const stored=body as MaterialRecord;
      setRecords(current=>draft.id?current.map(record=>record.id===draft.id?stored:record):[stored,...current]);
      setEditor(false);setNotice(draft.id?"Material updated successfully.":"Material added successfully.");
    }catch(problem){setError(problem instanceof Error?problem.message:"Unable to save material.")}finally{setSaving(false)}
  }

  return <>
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#147a4b]">Academic content</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-.045em] text-[#0b1f3a] md:text-4xl">Material Studio</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#607086]">Upload resources, organize academic metadata, configure access and prepare search-ready material pages.</p></div>
      <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-[#147a4b] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(20,122,75,.18)] hover:bg-[#0d5d39]"><Plus size={18}/>Add material</button>
    </div>

    <div className="mt-7 grid gap-4 sm:grid-cols-3">
      {[["Total material",records.length,FileText,"#147a4b"],["Published",records.filter(x=>x.status==="Published").length,Eye,"#276a9d"],["Total downloads",records.reduce((sum,x)=>sum+x.downloads,0).toLocaleString(),Download,"#b76a19"]].map(([label,value,Icon,color])=>{const I=Icon as typeof FileText;return <div key={label as string} className="flex items-center justify-between rounded-2xl border border-[#dfe6ec] bg-white p-5 shadow-[0_6px_22px_rgba(11,31,58,.035)]"><div><p className="text-xs font-bold uppercase tracking-[.06em] text-[#718094]">{label as string}</p><p className="mt-2 text-2xl font-extrabold tracking-[-.04em] text-[#0b1f3a]">{value as string|number}</p></div><span className="grid size-11 place-items-center rounded-xl bg-[#f4f7f9]" style={{color:color as string}}><I size={20}/></span></div>})}
    </div>

    <section className="mt-6 overflow-hidden rounded-2xl border border-[#dfe6ec] bg-white shadow-[0_8px_30px_rgba(11,31,58,.04)]">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#e5ebef] p-4">
        <label className="flex min-w-[230px] flex-1 items-center gap-3 rounded-xl bg-[#f4f7f9] px-4 py-3 text-[#607086] md:max-w-md"><Search size={17}/><span className="sr-only">Search materials</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search title, course or tag" className="min-w-0 flex-1 bg-transparent text-sm text-[#0b1f3a] outline-none"/></label>
        <span className="hidden text-[#9aa6b3] md:block"><Filter size={17}/></span>
        <span className="relative"><select value={categoryFilter} onChange={event=>setCategoryFilter(event.target.value)} className="appearance-none rounded-xl border border-[#dfe6ec] bg-white py-3 pl-4 pr-9 text-xs font-bold text-[#53657a]"><option>All</option>{categories.map(item=><option key={item}>{item}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8999]"/></span>
        <span className="relative"><select value={statusFilter} onChange={event=>setStatusFilter(event.target.value)} className="appearance-none rounded-xl border border-[#dfe6ec] bg-white py-3 pl-4 pr-9 text-xs font-bold text-[#53657a]"><option>All</option><option>Published</option><option>Draft</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8999]"/></span>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left"><thead><tr className="bg-[#f8fafb] text-[10px] font-extrabold uppercase tracking-[.09em] text-[#718094]"><th className="px-5 py-4">Material</th><th className="px-4 py-4">Course</th><th className="px-4 py-4">Category</th><th className="px-4 py-4">Access</th><th className="px-4 py-4">Downloads</th><th className="px-4 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{filtered.map(record=><tr key={record.id} className="border-t border-[#edf1f4] hover:bg-[#fbfcfd]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eaf6ef] text-[#147a4b]">{record.thumbnailUrl?<FileImage size={20}/>:<FileText size={20}/>}</span><div className="max-w-[310px]"><p className="truncate text-sm font-extrabold text-[#0b1f3a]">{record.title}</p><p className="mt-1 truncate text-[11px] text-[#7a899a]">{record.fileName||"No file attached"} · Updated {record.updatedAt}</p></div></div></td><td className="px-4 py-4 text-sm font-bold text-[#405169]">{record.course.split(" — ")[0]}</td><td className="px-4 py-4 text-sm text-[#607086]">{record.category}</td><td className="px-4 py-4"><span className={`text-xs font-bold ${record.access==="Free"?"text-[#147a4b]":"text-[#b76a19]"}`}>{record.access==="Free"?"Free":`PKR ${record.price}`}</span></td><td className="px-4 py-4 text-sm font-semibold text-[#53657a]">{record.downloads.toLocaleString()}</td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${record.status==="Published"?"bg-[#eaf6ef] text-[#147a4b]":"bg-[#fff4e5] text-[#9a5b19]"}`}>{record.status}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={()=>openEdit(record)} aria-label={`Edit ${record.title}`} className="grid size-9 place-items-center rounded-lg text-[#53657a] hover:bg-[#eaf6ef] hover:text-[#147a4b]"><Edit3 size={16}/></button><button onClick={()=>remove(record)} aria-label={`Delete ${record.title}`} className="grid size-9 place-items-center rounded-lg text-[#8a5960] hover:bg-red-50 hover:text-red-700"><Trash2 size={16}/></button><button aria-label={`More actions for ${record.title}`} className="grid size-9 place-items-center rounded-lg text-[#718094] hover:bg-[#f4f7f9]"><MoreHorizontal size={17}/></button></div></td></tr>)}</tbody></table>{loading?<div className="grid min-h-56 place-items-center text-sm font-semibold text-[#718094]">Loading real materials…</div>:!filtered.length?<div className="grid min-h-56 place-items-center text-center"><div><FileText className="mx-auto text-[#9aa6b3]"/><p className="mt-3 font-bold text-[#0b1f3a]">No materials yet</p><p className="mt-1 text-sm text-[#718094]">Add your first real resource.</p></div></div>:null}</div>
    </section>

    {editor?<div className="fixed inset-0 z-[60] flex justify-end bg-[#071426]/55 backdrop-blur-[2px]" onMouseDown={event=>{if(event.target===event.currentTarget&&!saving)setEditor(false)}}>
      <section role="dialog" aria-modal="true" aria-labelledby="material-editor-title" className="flex h-full w-full max-w-[850px] flex-col bg-[#f4f7f9] shadow-[-24px_0_70px_rgba(3,15,30,.24)]">
        <header className="flex items-center justify-between border-b border-[#dfe6ec] bg-white px-5 py-4 md:px-7"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#147a4b]">{draft.id?"Edit resource":"New resource"}</p><h2 id="material-editor-title" className="mt-1 text-xl font-extrabold tracking-[-.03em] text-[#0b1f3a]">{draft.id?draft.title||"Edit material":"Add learning material"}</h2></div><button disabled={saving} onClick={()=>setEditor(false)} className="grid size-10 place-items-center rounded-xl border border-[#dfe6ec] bg-white text-[#607086] hover:bg-[#f4f7f9]" aria-label="Close Material Studio"><X size={19}/></button></header>
        <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
            <section className="rounded-2xl border border-[#dfe6ec] bg-white p-5 shadow-[0_5px_20px_rgba(11,31,58,.03)] md:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[#0b1f3a] text-xs font-extrabold text-white">1</span><div><h3 className="text-sm font-extrabold text-[#0b1f3a]">Identity and placement</h3><p className="mt-0.5 text-xs text-[#7a899a]">Programs, courses and semesters come from their real admin records.</p></div></div>{!programs.length||!semesters.length||!courseRecords.length?<div className="mb-5 rounded-xl border border-[#f1d4aa] bg-[#fff8ed] p-4 text-xs leading-5 text-[#82501c]">Complete Programs, Semesters and Courses first. Material choices update automatically from those modules.</div>:null}<div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><TextField label="Material title" value={draft.title} onChange={value=>{update("title",value);if(!draft.id)update("slug",value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""))}} placeholder="Example: 8613 Research Proposal Guide"/></div><TextField label="Clean URL slug" value={draft.slug} onChange={value=>update("slug",value.toLowerCase().replace(/[^a-z0-9-]/g,""))} placeholder="8613-research-proposal-guide"/><SelectField label="Program" value={draft.program} onChange={value=>{const next=courseRecords.find(course=>course.program===value&&(!draft.semester||course.semester===draft.semester));setDraft(current=>({...current,program:value,course:next?`${next.code} — ${next.name}`:""}))}} options={programs}/><SelectField label="Semester" value={draft.semester} onChange={value=>{const next=courseRecords.find(course=>(!draft.program||course.program===draft.program)&&course.semester===value);setDraft(current=>({...current,semester:value,course:next?`${next.code} — ${next.name}`:""}))}} options={semesters}/><SelectField label="Course" value={draft.course} onChange={value=>update("course",value)} options={availableCourses}/><SelectField label="Category" value={draft.category} onChange={value=>update("category",value)} options={categories}/><SelectField label="Material type" value={draft.type} onChange={value=>update("type",value)} options={types}/><SelectField label="Language" value={draft.language} onChange={value=>update("language",value)} options={languages}/><SelectField label="Publishing status" value={draft.status} onChange={value=>update("status",value as MaterialRecord["status"])} options={["Draft","Published"]}/></div></section>

            <section className="rounded-2xl border border-[#dfe6ec] bg-white p-5 shadow-[0_5px_20px_rgba(11,31,58,.03)] md:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[#0b1f3a] text-xs font-extrabold text-white">2</span><div><h3 className="text-sm font-extrabold text-[#0b1f3a]">Files and access</h3><p className="mt-0.5 text-xs text-[#7a899a]">Attach the student download and its visual cover.</p></div></div><div className="grid gap-5 md:grid-cols-2"><DropField label="Resource file" kind="document" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" file={documentFile} onFile={setDocumentFile} existingName={draft.fileName}/><DropField label="Thumbnail image" kind="image" accept=".png,.jpg,.jpeg" file={thumbnailFile} onFile={setThumbnailFile}/><div className="md:col-span-2"><p className="mb-2 text-xs font-extrabold uppercase tracking-[.06em] text-[#53657a]">Access type</p><div className="grid grid-cols-2 gap-3">{(["Free","Paid"] as const).map(option=><button type="button" onClick={()=>update("access",option)} key={option} className={`rounded-xl border px-4 py-3 text-left transition ${draft.access===option?"border-[#147a4b] bg-[#eaf6ef] text-[#0d5d39]":"border-[#d7e0e7] bg-white text-[#53657a]"}`}><span className="block text-sm font-extrabold">{option}</span><span className="mt-1 block text-xs">{option==="Free"?"Students can download directly":"Students see the Order Help action"}</span></button>)}</div></div>{draft.access==="Paid"?<div className="md:col-span-2"><TextField label="Price in PKR" type="number" value={draft.price} onChange={value=>update("price",value)} placeholder="850"/></div>:null}</div></section>

            <section className="rounded-2xl border border-[#dfe6ec] bg-white p-5 shadow-[0_5px_20px_rgba(11,31,58,.03)] md:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[#0b1f3a] text-xs font-extrabold text-white">3</span><div><h3 className="text-sm font-extrabold text-[#0b1f3a]">Student-facing content</h3><p className="mt-0.5 text-xs text-[#7a899a]">Explain what the resource covers and how to use it.</p></div></div><div className="grid gap-4"><label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.06em] text-[#53657a]">Short description<textarea required rows={3} value={draft.description} onChange={event=>update("description",event.target.value)} maxLength={300} className="focus-ring resize-y rounded-xl border border-[#d7e0e7] p-4 text-sm font-normal normal-case leading-6 tracking-normal text-[#0b1f3a]"/><span className="text-right text-[10px] font-semibold normal-case tracking-normal text-[#8b98a6]">{draft.description.length}/300</span></label><label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.06em] text-[#53657a]">Material page content<textarea rows={7} value={draft.content} onChange={event=>update("content",event.target.value)} placeholder="Add headings, instructions, responsible-use guidance and download details…" className="focus-ring resize-y rounded-xl border border-[#d7e0e7] p-4 text-sm font-normal normal-case leading-6 tracking-normal text-[#0b1f3a]"/></label><TextField label="Tags" value={draft.tags} onChange={value=>update("tags",value)} placeholder="8613, research, proposal, B.Ed"/></div></section>

            <section className="rounded-2xl border border-[#dfe6ec] bg-white p-5 shadow-[0_5px_20px_rgba(11,31,58,.03)] md:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[#0b1f3a] text-xs font-extrabold text-white">4</span><div><h3 className="text-sm font-extrabold text-[#0b1f3a]">Search presentation</h3><p className="mt-0.5 text-xs text-[#7a899a]">Control how the page appears in search results.</p></div></div><div className="grid gap-4"><TextField label="SEO title" value={draft.seoTitle} onChange={value=>update("seoTitle",value)} placeholder={draft.title||"Search result title"}/><label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.06em] text-[#53657a]">Meta description<textarea rows={3} value={draft.metaDescription} onChange={event=>update("metaDescription",event.target.value)} maxLength={160} className="focus-ring resize-y rounded-xl border border-[#d7e0e7] p-4 text-sm font-normal normal-case leading-6 tracking-normal text-[#0b1f3a]"/><span className={`text-right text-[10px] font-semibold normal-case tracking-normal ${draft.metaDescription.length>160?"text-red-700":"text-[#8b98a6]"}`}>{draft.metaDescription.length}/160</span></label><div className="rounded-xl border border-[#dfe6ec] bg-[#f8fafb] p-4"><p className="truncate text-base font-semibold text-[#1a0dab]">{draft.seoTitle||draft.title||"Material page title"}</p><p className="mt-1 truncate text-xs text-[#147a4b]">sindheducationstuff.com/materials/{draft.slug||"material-slug"}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#53657a]">{draft.metaDescription||draft.description||"A concise description will appear here."}</p></div></div></section>
          </div>
          <footer className="border-t border-[#dfe6ec] bg-white px-5 py-4 md:px-7"><div className="flex flex-wrap items-center justify-between gap-3">{error?<p role="alert" className="text-xs font-bold text-red-700">{error}</p>:<p className="text-xs text-[#718094]">{draft.status==="Published"?"Visible to students after saving.":"Saved as an unpublished draft."}</p>}<div className="ml-auto flex gap-3"><button type="button" disabled={saving} onClick={()=>setEditor(false)} className="rounded-xl border border-[#d7e0e7] px-5 py-3 text-sm font-bold text-[#53657a]">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#147a4b] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving?<><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/>Uploading…</>:<><Check size={17}/>Save material</>}</button></div></div></footer>
        </form>
      </section>
    </div>:null}

    {notice?<div className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-xl bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-white shadow-xl"><Check size={17} className="text-[#55d393]"/>{notice}<button onClick={()=>setNotice("")} aria-label="Dismiss"><X size={15}/></button></div>:null}
  </>;
}
