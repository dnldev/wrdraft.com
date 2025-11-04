import { notFound } from "next/navigation";

import { getChampionById } from "@/lib/data-fetching";

export default async function ChampionPage({
                                               params,
                                           }: {
    params: { id: string };
}) {
    const champion = await getChampionById(params.id);

    if (!champion) {
        return notFound();
    }

    return (
        <div>
            <h1>{champion.name}</h1>
            {/* Render all the champion's details here using components */}
        </div>
    );
}