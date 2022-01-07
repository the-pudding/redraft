import { groups, mean, descending, ascending } from "d3";
import data from "$data/redrafted.csv";

const NO_VAL = -99;
const MINS = 1000;
const stats = ["VORP", "WS", "WA", "RWAR"];

// id,name,year,pick,team,seasons,games,minutes,VORP,WS,PIPM,WA,VORP_top,WS_top,PIPM_top,WA_top,redraft_VORP,redraft_WS,redraft_PIPM,redraft_WA,redraft_VORP_top,redraft_WS_top,redraft_PIPM_top,redraft_WA_top,redraft_blend,redraft_blend_top

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
	VORP: +d.minutes >= MINS ? +d.VORP : NO_VAL,
	WS: +d.minutes >= MINS ? +d.WS : NO_VAL,
	WA: +d.minutes >= MINS ? +d.WA : NO_VAL,
	RWAR: +d.minutes >= MINS ? +d.RWAR : NO_VAL,
	VORP_top: +d.minutes >= MINS ? +d.VORP_top : NO_VAL,
	WS_top: +d.minutes >= MINS ? +d.WS_top : NO_VAL,
	WA_top: +d.minutes >= MINS ? +d.WA_top : NO_VAL,
	RWAR_top: +d.minutes >= MINS ? +d.RWAR_top : NO_VAL
}));

stats.forEach((stat) => {
	const seasons = groups(clean, (d) => d.year);
	seasons.forEach(([year, players]) => {
		players.sort((a, b) => descending(a[`${stat}`], b[`${stat}`]) || ascending(a.pick, b.pick));
		players.forEach((p, i) => {
			p[`#_${stat}`] = i + 1;
		});

		players.sort(
			(a, b) => descending(a[`${stat}_top`], b[`${stat}_top`]) || ascending(a.pick, b.pick)
		);
		players.forEach((p, i) => {
			p[`#_${stat}_top`] = i + 1;
		});
	});
});

const mixed = clean.map((d) => ({
	...d,
	mixed: +mean(stats.map((v) => d[`#_${v}`])).toFixed(2),
	mixed_top: +mean(stats.map((v) => d[`#_${v}_top`])).toFixed(2)
}));

const seasonsB = groups(mixed, (d) => d.year);
seasonsB.forEach(([year, players]) => {
	players.sort((a, b) => ascending(+a.mixed_top, +b.mixed_top) || ascending(a.pick, b.pick));
	players.forEach((p, i) => {
		p[`#_mixed`] = i + 1;
		p.mixed_moved = p.pick - p[`#_mixed`];
	});

});


mixed.sort((a, b) => a.pick - b.pick);

export default mixed;