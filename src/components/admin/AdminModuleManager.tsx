"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Edit3, Plus, Search, Trash2, X } from "lucide-react";

type Props = {
  moduleKey: string;
  title: string;
  description: string;
  columns: string[];
};

type Row = { id: string; values: string[] };

function optionsForField(moduleKey:string,column:string,programOptions:string[],semesterOptions:string[]) {
  const name=column.toLowerCase();
  if(name==="status"){
    if(moduleKey==="programs"||moduleKey==="courses"||moduleKey==="semesters")return ["Active","Inactive"];
    if(moduleKey==="adsense-settings")return ["Disabled","Enabled"];
    if(moduleKey==="assignment-dates")return ["Upcoming","Extended","Closed"];
    return ["Draft","Published","Inactive"];
  }
  if(name==="program"&&moduleKey!=="programs")return programOptions;
  if(name==="semester"&&moduleKey!=="semesters")return semesterOptions;
  if(name==="category"&&moduleKey==="blog-posts")return ["Assignments","Research","Teaching Practice","Student Guide","News"];
  if(name==="rating")return ["5","4","3","2","1"];
  if(name==="location"&&moduleKey==="adsense-settings")return ["Below article introduction","Middle of blog article","Desktop sidebar","Before footer"];
  if(name==="slot"&&moduleKey==="adsense-settings")return ["Article intro","Article middle","Desktop sidebar","Before footer"];
  if(name==="order"&&moduleKey==="faqs")return ["1","2","3","4","5","6","7","8","9","10"];
  return [];
}
function isControlledField(moduleKey:string,column:string) {
  const name=column.toLowerCase();
  return ["status","rating"].includes(name)
    || (name==="semester"&&moduleKey!=="semesters")
    || (name==="program"&&moduleKey!=="programs")
    || (name==="category"&&moduleKey==="blog-posts")
    || (["location","slot"].includes(name)&&moduleKey==="adsense-settings")
    || (name==="order"&&moduleKey==="faqs");
}

export function AdminModuleManager({ moduleKey, title, description, columns }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [programOptions,setProgramOptions]=useState<string[]>([]);
  const [semesterOptions,setSemesterOptions]=useState<string[]>([]);

  useEffect(() => {
    let active=true;
    async function load(){
      const response=await fetch(`/api/admin/${moduleKey}`,{cache:"no-store"});
      const body=await response.json();
      if(!active)return;
      if(response.ok)setRows((body as Row[]).map(row=>({...row,values:row.values.map(String)})));
      else setError(body.error??`Unable to load ${title.toLowerCase()}.`);
      setLoading(false);
    }
    void load();
    return()=>{active=false};
  }, [moduleKey,title]);

  useEffect(()=>{
    if(!columns.some(column=>column.toLowerCase()==="program"))return;
    fetch("/api/admin/programs",{cache:"no-store"}).then(response=>response.ok?response.json():[]).then((programRows:Row[])=>{
      setProgramOptions(programRows.map(row=>row.values[0]).filter(Boolean));
    }).catch(()=>setProgramOptions([]));
  },[columns]);

  useEffect(()=>{
    if(!columns.some(column=>column.toLowerCase()==="semester")||moduleKey==="semesters")return;
    fetch("/api/admin/semesters",{cache:"no-store"}).then(response=>response.ok?response.json():[]).then((semesterRows:Row[])=>{
      setSemesterOptions(semesterRows.map(row=>row.values[0]).filter(Boolean));
    }).catch(()=>setSemesterOptions([]));
  },[columns,moduleKey]);

  const visibleRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? rows.filter(row => row.values.some(value => value.toLowerCase().includes(term))) : rows;
  }, [query, rows]);

  function openNew() {
    setDraft(columns.map(column => optionsForField(moduleKey,column,programOptions,semesterOptions)[0] ?? ""));
    setEditing({ id: "", values: [] });
    setNotice("");
  }

  function openEdit(row: Row) {
    setDraft([...row.values]);
    setEditing(row);
    setNotice("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!editing || draft.some(value => !value.trim())) {
      setNotice("Complete every field before saving.");
      return;
    }
    setSaving(true);setError("");
    const response=await fetch(`/api/admin/${moduleKey}`,{method:editing.id?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:editing.id||undefined,values:draft.map(value=>value.trim())})});
    const body=await response.json();
    if(!response.ok){setError(body.error??"Unable to save record.");setSaving(false);return}
    const saved={id:body.id as string,values:(body.values as (string|number)[]).map(String)};
    if(editing.id)setRows(current=>current.map(row=>row.id===editing.id?saved:row));
    else setRows(current=>[saved,...current]);
    setNotice(editing.id?`${title} entry updated.`:`${title} entry added.`);
    setEditing(null);
    setSaving(false);
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete “${row.values[0]}”?`)) return;
    const response=await fetch(`/api/admin/${moduleKey}?id=${encodeURIComponent(row.id)}`,{method:"DELETE"});
    if(!response.ok){const body=await response.json();setError(body.error??"Unable to delete record.");return}
    setRows(current => current.filter(item => item.id !== row.id));
    setNotice(`${row.values[0]} deleted.`);
  }

  return <>
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#147a4b]">Content management</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-[#0b1f3a] md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#607086]">{description}</p>
      </div>
      <button onClick={openNew} className="focus-ring inline-flex items-center gap-2 rounded-xl bg-[#147a4b] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(20,122,75,.18)] hover:bg-[#0d5d39]">
        <Plus size={18}/> Add new
      </button>
    </div>

    <div className="mt-7 rounded-2xl border border-[#dfe6ec] bg-white shadow-[0_8px_30px_rgba(11,31,58,.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5ebef] p-4">
        <label className="flex min-w-[240px] flex-1 items-center gap-3 rounded-xl bg-[#f4f7f9] px-4 py-3 text-[#607086] md:max-w-md">
          <Search size={18}/>
          <span className="sr-only">Search {title}</span>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} className="min-w-0 flex-1 bg-transparent text-sm text-[#0b1f3a] outline-none"/>
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#607086]">{visibleRows.length} {visibleRows.length === 1 ? "entry" : "entries"}</span>
        </div>
      </div>
      {error ? <p className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead><tr className="bg-[#f8fafb]">{columns.map(column => <th key={column} className="px-5 py-4 text-[11px] font-extrabold uppercase tracking-[.09em] text-[#607086]">{column}</th>)}<th className="px-5 py-4 text-right text-[11px] font-extrabold uppercase tracking-[.09em] text-[#607086]">Actions</th></tr></thead>
          <tbody>{visibleRows.map(row => <tr key={row.id} className="border-t border-[#edf1f4] transition hover:bg-[#fbfcfd]">{row.values.map((value, index) => <td key={`${row.id}-${columns[index]}`} className={`px-5 py-4 text-sm ${index === 0 ? "font-bold text-[#0b1f3a]" : "text-[#53657a]"}`}>{index === row.values.length - 1 && /active|published|verified|upcoming|completed/i.test(value) ? <span className="inline-flex rounded-full bg-[#eaf6ef] px-2.5 py-1 text-xs font-bold text-[#147a4b]">{value}</span> : value}</td>)}<td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => openEdit(row)} className="grid size-9 place-items-center rounded-lg text-[#53657a] hover:bg-[#eaf6ef] hover:text-[#147a4b]" aria-label={`Edit ${row.values[0]}`}><Edit3 size={16}/></button><button onClick={() => remove(row)} className="grid size-9 place-items-center rounded-lg text-[#8a5960] hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${row.values[0]}`}><Trash2 size={16}/></button></div></td></tr>)}</tbody>
        </table>
        {loading ? <div className="grid min-h-48 place-items-center px-6 text-center text-sm font-semibold text-[#607086]">Loading real records…</div> : !visibleRows.length ? <div className="grid min-h-48 place-items-center px-6 text-center"><div><p className="font-bold text-[#0b1f3a]">No records yet</p><p className="mt-1 text-sm text-[#607086]">Add your first real {title.toLowerCase()} record.</p></div></div> : null}
      </div>
    </div>

    {notice ? <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-white shadow-xl"><Check size={17} className="text-[#55d393]"/>{notice}<button onClick={() => setNotice("")} className="ml-2 text-slate-300" aria-label="Dismiss notice"><X size={15}/></button></div> : null}

    {editing ? <div className="fixed inset-0 z-[60] grid place-items-center bg-[#071426]/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setEditing(null); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="editor-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-[0_30px_90px_rgba(3,15,30,.3)]">
        <div className="flex items-start justify-between border-b border-[#e5ebef] p-6">
          <div><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#147a4b]">{editing.id ? "Edit entry" : "New entry"}</p><h2 id="editor-title" className="mt-2 text-2xl font-extrabold tracking-[-.03em] text-[#0b1f3a]">{editing.id ? `Edit ${editing.values[0]}` : `Add ${title.toLowerCase()} entry`}</h2></div>
          <button onClick={() => setEditing(null)} className="grid size-10 place-items-center rounded-xl border border-[#dfe6ec] text-[#607086] hover:bg-[#f4f7f9]" aria-label="Close editor"><X size={19}/></button>
        </div>
        <form onSubmit={save} className="grid gap-5 p-6 md:grid-cols-2">
          {columns.map((column, index) => {
            const options=optionsForField(moduleKey,column,programOptions,semesterOptions);
            const controlled=isControlledField(moduleKey,column);
            const name=column.toLowerCase();
            const update=(value:string)=>setDraft(current=>{
              const next=current.map((item,position)=>position===index?value:item);
              if(moduleKey==="programs"&&name==="program"&&!editing?.id){
                const slugIndex=columns.findIndex(item=>item.toLowerCase()==="slug");
                if(slugIndex>=0)next[slugIndex]=value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
              }
              return next;
            });
            const wide=["description","answer","quote","code","value"].some(part=>name.includes(part));
            return <label key={column} className={`grid gap-2 text-sm font-bold text-[#0b1f3a] ${wide||columns.length%2===1&&index===columns.length-1?"md:col-span-2":""}`}>{column}
              {controlled ? <span className="relative"><select autoFocus={index===0} value={draft[index]??""} onChange={event=>update(event.target.value)} className="focus-ring w-full appearance-none rounded-xl border border-[#d4dde5] bg-white px-4 py-3 pr-10 font-normal text-[#132238]" required><option value="">{options.length?`Select ${column.toLowerCase()}`:`Add ${column.toLowerCase()} records first`}</option>{options.map(option=><option key={option}>{option}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718094]"/></span>
              :wide?<textarea autoFocus={index===0} rows={name.includes("code")?6:4} value={draft[index]??""} onChange={event=>update(event.target.value)} className="focus-ring resize-y rounded-xl border border-[#d4dde5] bg-white px-4 py-3 font-normal leading-6 text-[#132238]" placeholder={`Enter ${column.toLowerCase()}`} required/>
              :<input autoFocus={index===0} type={name.includes("due")||name.includes("date")||name.includes("updated")?"date":name.includes("rating")||name==="order"?"number":"text"} value={draft[index]??""} onChange={event=>update(event.target.value)} className="focus-ring rounded-xl border border-[#d4dde5] bg-white px-4 py-3 font-normal text-[#132238]" placeholder={`Enter ${column.toLowerCase()}`} required/>}
            </label>;
          })}
          {error ? <p className="text-sm font-semibold text-red-700 md:col-span-2">{error}</p> : null}
          <div className="flex justify-end gap-3 border-t border-[#edf1f4] pt-5 md:col-span-2"><button type="button" disabled={saving} onClick={() => setEditing(null)} className="rounded-xl border border-[#d4dde5] px-5 py-3 text-sm font-bold text-[#405169]">Cancel</button><button disabled={saving} className="rounded-xl bg-[#147a4b] px-5 py-3 text-sm font-bold text-white hover:bg-[#0d5d39] disabled:opacity-60">{saving?"Saving…":"Save changes"}</button></div>
        </form>
      </section>
    </div> : null}
  </>;
}
