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
	id: d.id,
	name: d.name,
	minutes: +d.minutes,
	year: +d.year,
	team: swapTeam(d.team),
	pick: +d.pick,
	image: d.image === "true",
	VORP: +d.minutes >= MINS ? +d.VORP_top : NO_VAL,
	WS: +d.minutes >= MINS ? +d.WS_top : NO_VAL,
	WA: +d.minutes >= MINS ? +d.WA_top : NO_VAL,
	RWAR: +d.minutes >= MINS ? +d.RWAR_top : NO_VAL
}));

const scales = stats.map((stat) => {
	const extents = extent(clean.filter(d => d[stat] !== NO_VAL).map(d => d[stat]));
	const scale = scaleLinear().domain(extents).clamp(true);
	return scale;
});

// normalize stats
clean.forEach((p) => {
	let sum = 0;
	stats.forEach((stat, i) => {
		const v = scales[i](p[stat]);
		p[`norm_${stat}`] = +v.toFixed(2);
		sum += v;
	});
	p.norm_sum = +sum.toFixed(2);
});

const scaleBlend = scaleLinear().domain(extent(clean, d => d.norm_sum)).clamp(true);
clean.forEach((p) => {
	p.norm_blend = +(scaleBlend(p.norm_sum)).toFixed(2);
});

[...stats, "blend"].forEach((stat) => {
	const seasons = groups(clean, (d) => d.year);
	seasons.forEach(([year, players]) => {
		players.sort((a, b) => descending(a[`norm_${stat}`], b[`norm_${stat}`]) || ascending(a.pick, b.pick));
		players.forEach((p, i) => {
			p[`rank_${stat}`] = i + 1;
			if (stat === "blend") p.moved = p.pick - (i + 1);
		});
	});
});

clean.sort((a, b) => a.pick - b.pick);

export default clean;