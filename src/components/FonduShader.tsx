import GrainDegrade from "./GrainDegrade";

// Transition papier → bleu au-dessus du footer : long dégradé granuleux qui ondule.
// data-fondu : repère lu par l'en-tête, qui bleuit au même rythme qu'on descend.
export default function FonduShader({ className = "" }: { className?: string }) {
  return (
    <div data-fondu className={`relative overflow-hidden bg-papier ${className}`} aria-hidden="true">
      <GrainDegrade className="absolute inset-0" />
      <div className="grain-aplat absolute inset-0 pointer-events-none" />
    </div>
  );
}
