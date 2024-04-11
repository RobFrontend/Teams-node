module.exports = (tempTeams, team) => {
  let output = tempTeams.replace(/{%TEAMNAME%}/g, team.name);
  output = output.replace(/{%TEAMPHOTO%}/g, team.logo);
  output = output.replace(/{%TEAMSTATE%}/g, team.state);
  output = output.replace(/{%TEAMCHAMPIONSHIPS%}/g, team.championships);
  output = output.replace(/{%TEAMID%}/g, team.id);
  return output;
};
