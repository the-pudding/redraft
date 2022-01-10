import { scaleLinear, extent, groups, mean, descending, ascending } from "d3";
import data from "$data/redrafted.csv";

const NO_VAL = -99;
const MINS = 1000;
const stats = ["VORP", "WS", "WA", "RWAR"];

const swapTeam = (t) => {
	if (["NOK", "NOH"].includes(t)) return "NOP";
	if (["CHO", "CHH"].includes(t)) return "CHA";
	if (t === "VAN") return "MEM";
	if (t === "WSB") return "WAS";
	if (t === "NJN") return "BRK";
	if (t === "SEA") return "OKC";
	return t;
};

const clean = data.map((d) => ({
	name: d.name,
	minutes: +d.minutes,
	year: +d.year,
	team: swapTeam(d.team),
	pick: +d.pick,
	VORP: +d.minutes >= MINS ? +d.VORP_top : NO_VAL,
	WS: +d.minutes >= MINS ? +d.WS_top : NO_VAL,
	WA: +d.minutes >= MINS ? +d.WA_top : NO_VAL,
	RWAR: +d.minutes >= MINS ? +d.RWAR_top : NO_VAL
}));

stats.forEach((stat) => {

	const extents = extent(clean.map(d => d[stat]));
	const scale = scaleLinear().domain(extents);

	const seasons = groups(clean, (d) => d.year);
	seasons.forEach(([year, players]) => {
		players.sort((a, b) => descending(a[`${stat}`], b[`${stat}`]) || ascending(a.pick, b.pick));
		players.forEach((p, i) => {
			p[`norm_${stat}`] = scale(p[stat]);
			p[`rank_${stat}`] = i + 1;
		});
	});
});

const withBlend = clean.map((d) => ({
	...d,
	blend: +mean(stats.map((v) => d[`rank_${v}`])).toFixed(2),
	norm_blend: +mean(stats.map((v) => d[`norm_${v}`])).toFixed(2),
}));

const seasonsB = groups(withBlend, (d) => d.year);
seasonsB.forEach(([year, players]) => {
	players.sort((a, b) => ascending(+a.blend, +b.blend) || ascending(a.pick, b.pick));
	players.forEach((p, i) => {
		p.rank_blend = i + 1;
		p.moved = p.pick - p.rank_blend;
	});
});


withBlend.sort((a, b) => a.pick - b.pick);

export default withBlend;