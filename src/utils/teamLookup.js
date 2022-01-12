import teams from "$data/teams.json";

const city = (abbr) => {
	const match = teams.find(d => d.abbr === abbr);
	if (match) return match.city;
	return "";
};

const name = (abbr) => {
	const match = teams.find(d => d.abbr === abbr);
	if (match) return match.name;
	return "";
};

const mascot = (abbr) => {
	const match = teams.find(d => d.abbr === abbr);
	if (match) return match.mascot;
	return "";
};
export { city, name, mascot };