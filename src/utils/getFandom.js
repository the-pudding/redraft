import { ascending, descending } from "d3";
import teams from "$data/teams.json";

export default function getFandom({ region, loc }) {
	console.log({ region, loc });
	if (!loc) return teams.find(d => d.abbr === "LAL");
	const [lat, lng] = loc.split(",").map(d => +d.trim());
	const result = teams.map(t => ({
		...t,
		dist: Math.sqrt((t.latitude - lat) * (t.latitude - lat) + (t.longitude - lng) * (t.longitude - lng)),
		sameState: t.state === region
	}));
	result.sort((a, b) => descending(a.sameState, b.sameState) || ascending(a.dist, b.dist))

	return result[0];
}