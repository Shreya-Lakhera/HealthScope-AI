import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowLeft, ArrowRight, Brain, CircleAlert, Droplets, ExternalLink, HeartPulse, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { getScreeningInfo, parameterGuidance, screeningInfo } from "@/lib/screening-info";

const icons = { heart: HeartPulse, liver: Activity, kidney: Droplets, stroke: Brain };

export function generateStaticParams() {
  return screeningInfo.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const screening = getScreeningInfo(id);
  return screening ? { title: `${screening.name} overview | MediLocker`, description: screening.overview } : {};
}

export default async function ScreeningOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const screening = getScreeningInfo(id);
  if (!screening) notFound();
  const Icon = icons[screening.id];

  return <main className="detail-page" style={{ "--detail-accent": screening.accent } as React.CSSProperties}>
    <header className="topbar"><Link className="brand" href="/"><span className="brand-mark"><HeartPulse size={20}/></span>Medi<span>Locker</span></Link><div className="privacy-pill"><LockKeyhole size={15}/> Educational use only</div></header>
    <section className="detail-hero"><div className="detail-hero-inner"><Link className="back" href="/"><ArrowLeft size={16}/> All health checks</Link><div className="detail-title"><span className="detail-icon"><Icon size={34}/></span><div><p className="section-kicker">Know before you check</p><h1>{screening.name}</h1></div></div><p>{screening.overview}</p><Link className="primary-link" href={`/?screening=${screening.id}`}><Sparkles size={17}/> Start this health check <ArrowRight size={17}/></Link></div></section>
    <div className="detail-grid">
      <section className="detail-card symptoms-card"><div className="detail-card-heading"><CircleAlert/><div><p className="section-kicker">What to notice</p><h2>Common symptoms</h2></div></div><p className="section-intro">Symptoms vary, and having one does not confirm the condition. Some people have no obvious symptoms.</p><ul>{screening.symptoms.map(symptom=><li key={symptom}>{symptom}</li>)}</ul>{screening.urgent&&<div className="urgent-note"><strong>Act now:</strong> {screening.urgent}</div>}<a className="source-link" href={screening.source.url} target="_blank" rel="noreferrer">Read the health guidance: {screening.source.label} <ExternalLink size={14}/></a></section>
      <section className="detail-card model-card"><div className="detail-card-heading"><Brain/><div><p className="section-kicker">Under the hood</p><h2>About the model</h2></div></div><span className="algorithm-pill">{screening.model.algorithm}</span><p>{screening.model.summary}</p><h3>How inputs are prepared</h3><ul>{screening.model.preprocessing.map(step=><li key={step}>{step}</li>)}</ul><div className="safety-note"><ShieldCheck size={18}/><p>This model finds statistical patterns; it does not examine you, establish a diagnosis, or recommend treatment.</p></div></section>
      <section className="detail-card parameters-card"><div className="detail-card-heading"><Activity/><div><p className="section-kicker">Model recipe</p><h2>{screening.model.parameters.length} input parameters</h2></div></div><p className="parameter-note">Use values from your own current clinical or laboratory report. The references below are broad educational guides—not personal targets—and your report’s range takes priority.</p><div className="parameter-grid">{screening.model.parameters.map(parameter=>{const guidance=parameterGuidance[screening.id]?.[parameter.name];return <div className="parameter" key={parameter.name}><code>{parameter.name}</code><strong>{parameter.meaning}</strong>{guidance&&<><span className="reference-label">Typical reference</span><span>{guidance.reference}</span><span className="reference-label">What to enter</span><span>{guidance.enter}</span></>}</div>})}</div></section>
    </div>
    <section className="detail-cta"><div><p className="section-kicker">Ready when you are</p><h2>Have your values nearby?</h2><p>The form checks every input before securely sending it to your local prediction API.</p></div><Link className="primary-link" href={`/?screening=${screening.id}`}>Open {screening.shortName} check <ArrowRight size={17}/></Link></section>
    <footer><div className="footer-warning"><ShieldCheck size={20}/><p><strong>Educational use only.</strong> Symptoms require professional assessment. This model cannot diagnose, rule out disease, or replace emergency care.</p></div><p>MediLocker · Built with privacy and clarity in mind.</p></footer>
  </main>;
}
