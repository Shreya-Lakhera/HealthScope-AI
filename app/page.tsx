"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, ArrowRight, Brain, Check, CircleAlert, Droplets, HeartPulse, LockKeyhole, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type Field={key:string;label:string;help:string;unit?:string;min?:number;max?:number;step?:number;options?:{label:string;value:string}[]};
type Screening={id:"heart"|"liver"|"kidney"|"stroke";name:string;count:number;description:string;icon:typeof HeartPulse;color:string;available:boolean;fields:Field[]};
type Prediction={prediction:number;classification:string;risk_probability:number;risk_percentage:number;disclaimer:string};
const API_URL=import.meta.env.VITE_API_URL??"http://127.0.0.1:8000";
const screenings:Screening[]=[
 {id:"heart",name:"Heart disease",count:13,description:"Uses routine cardiology measurements including blood pressure, cholesterol and ECG results.",icon:HeartPulse,color:"#ef476f",available:true,fields:[
  {key:"age",label:"Age",help:"Age in completed years",unit:"years",min:18,max:100},
  {key:"sex",label:"Sex",help:"Value used in the original training data",options:[{label:"Female (0)",value:"0"},{label:"Male (1)",value:"1"}]},
  {key:"cp",label:"Chest pain type",help:"Clinical category from 0 to 3",options:[{label:"Typical angina (0)",value:"0"},{label:"Atypical angina (1)",value:"1"},{label:"Non-anginal pain (2)",value:"2"},{label:"Asymptomatic (3)",value:"3"}]},
  {key:"trestbps",label:"Resting blood pressure",help:"Resting systolic pressure",unit:"mm Hg",min:70,max:240},
  {key:"chol",label:"Serum cholesterol",help:"Total serum cholesterol",unit:"mg/dL",min:80,max:700},
  {key:"fbs",label:"Fasting blood sugar > 120",help:"Whether fasting blood sugar exceeds 120 mg/dL",options:[{label:"No (0)",value:"0"},{label:"Yes (1)",value:"1"}]},
  {key:"restecg",label:"Resting ECG",help:"Resting electrocardiogram result",options:[{label:"Normal (0)",value:"0"},{label:"ST-T abnormality (1)",value:"1"},{label:"Left ventricular hypertrophy (2)",value:"2"}]},
  {key:"thalach",label:"Maximum heart rate",help:"Highest heart rate achieved",unit:"bpm",min:50,max:230},
  {key:"exang",label:"Exercise-induced angina",help:"Angina brought on by exercise",options:[{label:"No (0)",value:"0"},{label:"Yes (1)",value:"1"}]},
  {key:"oldpeak",label:"ST depression",help:"ST depression induced by exercise",min:0,max:7,step:.1},
  {key:"slope",label:"Peak ST slope",help:"Slope of peak exercise ST segment",options:[{label:"Upsloping (0)",value:"0"},{label:"Flat (1)",value:"1"},{label:"Downsloping (2)",value:"2"}]},
  {key:"ca",label:"Major vessels",help:"Number colored by fluoroscopy",min:0,max:4},
  {key:"thal",label:"Thalassemia result",help:"Coded thallium stress-test result",options:[{label:"Normal (1)",value:"1"},{label:"Fixed defect (2)",value:"2"},{label:"Reversible defect (3)",value:"3"}]}
 ]},
 {id:"liver",name:"Liver disease",count:9,description:"Uses a standard liver function panel including bilirubin, enzymes, proteins and albumin.",icon:Activity,color:"#7c6ee6",available:true,fields:[
  {key:"Age",label:"Age",help:"Age in completed years",unit:"years",min:4,max:100},
  {key:"Total_Bilirubin",label:"Total bilirubin",help:"Total bilirubin concentration",unit:"mg/dL",min:.1,max:80,step:.1},
  {key:"Direct_Bilirubin",label:"Direct bilirubin",help:"Conjugated bilirubin concentration",unit:"mg/dL",min:.1,max:25,step:.1},
  {key:"Alkaline_Phosphotase",label:"Alkaline phosphatase",help:"ALP enzyme level",unit:"IU/L",min:20,max:2500},
  {key:"Alamine_Aminotransferase",label:"Alanine aminotransferase",help:"ALT enzyme level",unit:"IU/L",min:1,max:2500},
  {key:"Aspartate_Aminotransferase",label:"Aspartate aminotransferase",help:"AST enzyme level",unit:"IU/L",min:1,max:5500},
  {key:"Total_Protiens",label:"Total proteins",help:"Total protein concentration",unit:"g/dL",min:1,max:12,step:.1},
  {key:"Albumin",label:"Albumin",help:"Serum albumin concentration",unit:"g/dL",min:.1,max:8,step:.1},
  {key:"Albumin_and_Globulin_Ratio",label:"Albumin / globulin ratio",help:"Calculated A/G ratio",min:.1,max:4,step:.01}
 ]},
 {id:"kidney",name:"Chronic kidney disease",count:24,description:"Uses blood, urine, and clinical measurements associated with kidney function.",icon:Droplets,color:"#13a8a8",available:true,fields:[
  {key:"age",label:"Age",help:"Age in completed years",unit:"years",min:1,max:120},{key:"bp",label:"Blood pressure",help:"Diastolic blood pressure",unit:"mm Hg",min:40,max:200},{key:"sg",label:"Specific gravity",help:"Urine specific gravity",min:1.005,max:1.025,step:.005},{key:"al",label:"Albumin",help:"Urine albumin category",min:0,max:5},{key:"su",label:"Sugar",help:"Urine sugar category",min:0,max:5},{key:"bgr",label:"Blood glucose",help:"Random blood glucose",unit:"mg/dL",min:20,max:500},{key:"bu",label:"Blood urea",help:"Blood urea concentration",unit:"mg/dL",min:1,max:400},{key:"sc",label:"Serum creatinine",help:"Serum creatinine concentration",unit:"mg/dL",min:.1,max:80,step:.1},{key:"sod",label:"Sodium",help:"Serum sodium",unit:"mEq/L",min:80,max:180},{key:"pot",label:"Potassium",help:"Serum potassium",unit:"mEq/L",min:1,max:50,step:.1},{key:"hemo",label:"Hemoglobin",help:"Hemoglobin concentration",unit:"g/dL",min:1,max:25,step:.1},{key:"pcv",label:"Packed cell volume",help:"Packed cell volume",unit:"%",min:5,max:70},{key:"wc",label:"White blood cells",help:"White blood cell count",unit:"cells/cmm",min:1000,max:30000},{key:"rc",label:"Red blood cells",help:"Red blood cell count",unit:"millions/cmm",min:1,max:10,step:.1},
  {key:"rbc",label:"Red blood cells",help:"Urine red blood-cell appearance",options:[{label:"Normal",value:"normal"},{label:"Abnormal",value:"abnormal"}]},{key:"pc",label:"Pus cells",help:"Urine pus-cell appearance",options:[{label:"Normal",value:"normal"},{label:"Abnormal",value:"abnormal"}]},{key:"pcc",label:"Pus-cell clumps",help:"Whether pus-cell clumps are present",options:[{label:"Not present",value:"notpresent"},{label:"Present",value:"present"}]},{key:"ba",label:"Bacteria",help:"Whether bacteria are present",options:[{label:"Not present",value:"notpresent"},{label:"Present",value:"present"}]},{key:"htn",label:"Hypertension",help:"History of hypertension",options:[{label:"No",value:"no"},{label:"Yes",value:"yes"}]},{key:"dm",label:"Diabetes mellitus",help:"History of diabetes",options:[{label:"No",value:"no"},{label:"Yes",value:"yes"}]},{key:"cad",label:"Coronary artery disease",help:"History of coronary artery disease",options:[{label:"No",value:"no"},{label:"Yes",value:"yes"}]},{key:"appet",label:"Appetite",help:"Current appetite",options:[{label:"Good",value:"good"},{label:"Poor",value:"poor"}]},{key:"pe",label:"Pedal edema",help:"Whether pedal edema is present",options:[{label:"No",value:"no"},{label:"Yes",value:"yes"}]},{key:"ane",label:"Anemia",help:"Whether anemia is present",options:[{label:"No",value:"no"},{label:"Yes",value:"yes"}]}
 ]},
 {id:"stroke",name:"Stroke",count:10,description:"Uses demographic, cardiovascular, glucose, BMI, and smoking information.",icon:Brain,color:"#f59e55",available:true,fields:[
  {key:"gender",label:"Gender",help:"Category used in the training dataset",options:[{label:"Female",value:"Female"},{label:"Male",value:"Male"},{label:"Other",value:"Other"}]},{key:"age",label:"Age",help:"Age in years",unit:"years",min:0,max:120,step:.1},{key:"hypertension",label:"Hypertension",help:"History of hypertension",options:[{label:"No",value:"0"},{label:"Yes",value:"1"}]},{key:"heart_disease",label:"Heart disease",help:"History of heart disease",options:[{label:"No",value:"0"},{label:"Yes",value:"1"}]},{key:"ever_married",label:"Ever married",help:"Marital-history category",options:[{label:"No",value:"No"},{label:"Yes",value:"Yes"}]},{key:"work_type",label:"Work type",help:"Current work category",options:[{label:"Private",value:"Private"},{label:"Self-employed",value:"Self-employed"},{label:"Government job",value:"Govt_job"},{label:"Children",value:"children"},{label:"Never worked",value:"Never_worked"}]},{key:"Residence_type",label:"Residence type",help:"Urban or rural residence",options:[{label:"Urban",value:"Urban"},{label:"Rural",value:"Rural"}]},{key:"avg_glucose_level",label:"Average glucose",help:"Average blood glucose level",unit:"mg/dL",min:20,max:350,step:.01},{key:"bmi",label:"BMI",help:"Body mass index",unit:"kg/m²",min:10,max:100,step:.1},{key:"smoking_status",label:"Smoking status",help:"Smoking-history category",options:[{label:"Never smoked",value:"never smoked"},{label:"Formerly smoked",value:"formerly smoked"},{label:"Smokes",value:"smokes"},{label:"Unknown",value:"Unknown"}]}
 ]}
];

export default function Home(){
 const [selected,setSelected]=useState<Screening|null>(null),[values,setValues]=useState<Record<string,string>>({}),[result,setResult]=useState<Prediction|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
 const completed=selected?selected.fields.filter(f=>values[f.key]!==undefined&&values[f.key]!=="").length:0;
 const orderedPayload=useMemo(()=>selected?.fields.map(f=>values[f.key])??[],[selected,values]);
 function reset(){setSelected(null);setValues({});setResult(null);setError("");window.scrollTo({top:0,behavior:"smooth"})}
 async function submitScreening(){
  if(!selected)return;
  setLoading(true);setError("");
  const payload=Object.fromEntries(selected.fields.map(f=>{const value=values[f.key];return [f.key,value!==""&&Number.isFinite(Number(value))?Number(value):value]}));
  try{
   const response=await fetch(`${API_URL}/predict/${selected.id}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   if(!response.ok)throw new Error("The prediction service rejected these values.");
   setResult(await response.json());
  }catch(reason){setError(reason instanceof Error?reason.message:"The prediction service is unavailable.");}
  finally{setLoading(false);}
 }
 useEffect(()=>{
  const requested=new URLSearchParams(window.location.search).get("screening");
  const screening=screenings.find(item=>item.id===requested);
  if(!screening)return;
  const timer=window.setTimeout(()=>{
   setSelected(screening);
   window.setTimeout(()=>document.getElementById("screening-form")?.scrollIntoView(),50);
  },0);
  return()=>window.clearTimeout(timer);
 },[]);
 return <main>
  <header className="topbar"><a className="brand" href="#top"><span className="brand-mark"><HeartPulse size={20}/></span>HealthScope<span>AI</span></a><div className="privacy-pill"><LockKeyhole size={15}/> Values are not stored</div></header>
  <section className="hero" id="top"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-spark spark-one">✦</div><div className="hero-spark spark-two">✚</div><div className="hero-inner"><div className="eyebrow"><Sparkles size={15}/> Your health data, made friendlier</div><h1>See a clearer view<br/><span>of your health.</span></h1><p>Pick a health check, add values from your clinician or lab report, and let HealthScope AI turn them into an easy-to-read educational estimate. Quick, private, and judgment-free.</p><div className="hero-chips"><span>⚡ Fast estimates</span><span>🔒 Nothing stored</span><span>✨ Four health checks</span></div></div></section>
  {!selected?<><section className="screenings"><div className="section-heading"><div><p className="section-kicker">Pick your health quest</p><h2>What would you like to check?</h2></div><span>4 models ready to go</span></div><div className="card-grid">
   {screenings.map((s,i)=>{const Icon=s.icon;return <Link className={"screen-card "+(!s.available?"disabled":"")} href={`/screenings/${s.id}`} key={s.id} style={{"--accent":s.color,"--delay":`${i*70}ms`} as React.CSSProperties}><div className="card-top"><span className="icon-box"><Icon size={23}/></span><span className={"status "+(s.available?"ready":"soon")}>{s.available?"Ready to explore":"Needs model"}</span></div><h3>{s.name}</h3><div className="feature-count">{s.count} quick inputs</div><p>{s.description}</p><span className="card-action">Explore this check <ArrowRight size={16}/></span></Link>})}
  </div></section><section className="trust-strip"><div><Stethoscope/><h3>Clinically shaped forms</h3><p>Plain-language labels map to the exact feature order used during training.</p></div><div><ShieldCheck/><h3>Validated inputs</h3><p>Required values and realistic bounds help prevent malformed model requests.</p></div><div><LockKeyhole/><h3>Nothing stored</h3><p>Form values are held only for this session and reset when you leave.</p></div></section></>:
  <section className="form-section" id="screening-form"><button className="back" onClick={reset}><ArrowLeft size={16}/> All screenings</button><div className="form-shell"><aside className="form-aside" style={{"--accent":selected.color} as React.CSSProperties}><span className="large-icon"><selected.icon size={30}/></span><p className="section-kicker">Educational screening</p><h2>{selected.name}</h2><p>{selected.description}</p><div className="completion"><div><span>Form progress</span><strong>{completed}/{selected.fields.length}</strong></div><Progress value={(completed/selected.fields.length)*100}/></div><div className="aside-note"><CircleAlert size={18}/><span>Use values from a recent clinical report where possible. Do not guess laboratory results.</span></div></aside>
   <form className="clinical-form" onSubmit={e=>{e.preventDefault();void submitScreening()}}>{!result?<><div className="form-title"><div><p className="section-kicker">Model inputs</p><h2>Enter your clinical values</h2></div><span>All fields required</span></div><div className="fields-grid">
    {selected.fields.map((f,i)=><div className="field" key={f.key}><Label htmlFor={f.key}><span>{String(i+1).padStart(2,"0")}</span>{f.label}</Label><p>{f.help}</p><div className="input-wrap">{f.options?<select id={f.key} required value={values[f.key]??""} onChange={e=>setValues({...values,[f.key]:e.target.value})}><option value="" disabled>Select one</option>{f.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:<Input id={f.key} type="number" required min={f.min} max={f.max} step={f.step??1} value={values[f.key]??""} onChange={e=>setValues({...values,[f.key]:e.target.value})} placeholder="Enter value"/>}{f.unit&&<span className="unit">{f.unit}</span>}</div></div>)}
   </div>{error&&<div className="form-error" role="alert">{error} Make sure the API is running on port 8000.</div>}<div className="submit-row"><p><LockKeyhole size={15}/> Your entries are not saved.</p><Button type="submit" size="lg" disabled={loading}>{loading?"Calculating…":"Get educational estimate"} <ArrowRight/></Button></div></>:<div className="result-panel"><div className="success-icon"><Check size={32}/></div><p className="section-kicker">Model estimate complete</p><h2>{result.risk_percentage}% model likelihood</h2><p>The model classified this input as <strong>{result.prediction===1?"higher":"lower"} likelihood</strong> for {selected.name.toLowerCase()}.</p><div className="payload"><div><span>Ordered feature values</span><small>{selected.id} model</small></div><code>[{orderedPayload.join(", ")}]</code></div><div className="model-note"><CircleAlert size={19}/><p><strong>Educational estimate only.</strong> {result.disclaimer} Model output can be wrong and must not replace a clinician’s assessment.</p></div><div className="result-actions"><Button type="button" variant="outline" onClick={()=>setResult(null)}>Edit values</Button><Button type="button" onClick={reset}>Choose another screening</Button></div></div>}</form>
  </div></section>}
  <footer><div className="footer-warning"><ShieldCheck size={20}/><p><strong>Educational use only.</strong> This tool organizes inputs for statistical models; it does not diagnose, treat or replace advice from a qualified healthcare professional.</p></div><p>Built with privacy and clarity in mind.</p></footer>
 </main>
}
