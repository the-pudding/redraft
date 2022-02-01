import { scaleLinear, scaleQuantize, max, extent, group, groups, descending, ascending } from "d3";
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
	rookie_team: swapTeam(d.rookie_team),
	pick: +d.pick,
	image: d.image === "true",
	VORP: +d.minutes >= MINS ? +d.VORP_top : NO_VAL,
	WS: +d.minutes >= MINS ? +d.WS_top : NO_VAL,
	WA: +d.minutes >= MINS ? +d.WA_top : NO_VAL,
	RWAR: +d.minutes >= MINS ? +d.RWAR_top : NO_VAL
}));

const scales = stats.map((stat) => {
	const extents = extent(clean.filter(d => d[stat] !== NO_VAL).map(d => d[stat]));
	const scale = scaleLinear().domain(extents).range([0, 100]).clamp(true);
	return scale;
});

// normalize stats
clean.forEach((p) => {
	let sum = 0;
	stats.forEach((stat, i) => {
		const v = scales[i](p[stat]);
		p[`norm_${stat}`] = +v.toFixed(1);
		sum += v;
	});
	p.norm_sum = +sum.toFixed(1);
});

// normalize blend
const scaleBlend = scaleLinear().domain(extent(clean, d => d.norm_sum)).range([0, 100]).clamp(true);
clean.forEach((p) => {
	p.norm_blend = +(scaleBlend(p.norm_sum)).toFixed(1);
});

// ranks and moved spots
[...stats, "blend"].forEach((stat) => {
	const draftsRank = groups(clean, (d) => d.year);
	draftsRank.forEach(([year, players]) => {
		players.sort((a, b) => descending(a[`norm_${stat}`], b[`norm_${stat}`]) || ascending(a.pick, b.pick));
		players.forEach((p, i) => {
			p[`rank_${stat}`] = i + 1;
			if (stat === "blend") p.moved = p.pick - (i + 1);
		});
	});
});

// upgrade
const drafts = group(clean, (d) => d.year);

Array.from(drafts).forEach(([year]) => {
	const players = drafts.get(year);
	players.sort((a, b) => descending(a.norm_blend, b.norm_blend));
});


const getUpgrade = (p) => {
	const players = drafts.get(p.year);
	const match = players.find(
		(other) =>
			!upgraded[`${other.id}${p.rookie_team}`] &&
			other.rookie_team !== p.rookie_team &&
			other.pick > p.pick &&
			other.norm_blend > p.norm_blend
	);
	if (match) upgraded[`${match.id}${p.rookie_team}`] = true;
	return match || {};
};

const getBetterCount = p => {
	const players = drafts.get(p.year);
	const matches = players.filter(
		(other) =>
			other.rookie_team !== p.rookie_team &&
			other.pick > p.pick &&
			other.norm_blend > p.norm_blend
	);
	return matches.length;
};

const upgraded = {};

clean.forEach(d => {
	const u = getUpgrade(d);
	d.betterCount = getBetterCount(d);
	d.upgrade = u.id;
	d.upgradeName = u.name;
	d.potential = u.id ? +(u.norm_blend - d.norm_blend).toFixed(1) : 0;
});


// const maxPotential = max(clean, d => d.potential);
// const scalePotential = scaleLinear().domain([maxPotential, 0]).range([0, 100]);

// clean.forEach(d => {
// 	d.potentialScaled = +scalePotential(d.potential).toFixed(1);
// });


// grade
const draftsGrade = groups(clean, (d) => d.year);

const scaleG = scaleQuantize()
	.domain(extent(clean.filter(d => d.potential > 0), d => d.potential))
	.range(["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"]);

draftsGrade.forEach(([year, players]) => {
	const first = players.filter(d => d.pick <= 30);

	first.forEach((p, i) => {
		p.grade = p.potential === 0 ? "A+" : scaleG(p.potential);
	});

	first.sort((a, b) => ascending(a.potential, b.potential));
});

clean.sort((a, b) => a.pick - b.pick);

export default clean;