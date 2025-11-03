// A simplified example of what this file would look like
import { champions } from "@/data/championData"; // Import your data

export default function ChampionPage({ params }: { params: { id: string } }) {
  const champion = champions.find((c) => c.id === params.id);

  if (!champion) {
    return <div>Champion not found</div>;
  }

  return (
    <div>
      <h1>{champion.name}</h1>
      {/* Render all the champion's details here using components */}
    </div>
  );
}
