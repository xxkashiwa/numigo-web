import mermaid from 'mermaid';
import { useEffect } from 'react';

const Mermaid = ({ chart }: { chart: string }) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  return <div className="mermaid">{chart}</div>;
};

export default Mermaid;
