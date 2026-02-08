export default function NarrativeComparePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-terminal-green font-mono uppercase tracking-wider">叙事对比</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-terminal-medium-gray bg-terminal-dark-gray p-6 rounded-sm h-96">
           <p className="text-terminal-light-gray">叙事 A</p>
        </div>
        <div className="border border-terminal-medium-gray bg-terminal-dark-gray p-6 rounded-sm h-96">
           <p className="text-terminal-light-gray">叙事 B</p>
        </div>
      </div>
    </div>
  );
}
