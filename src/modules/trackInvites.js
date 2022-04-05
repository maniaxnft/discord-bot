const getTop10Invites = async (bot) => {
  const invites = await bot?.guilds?.cache
    ?.get(process.env.DISCORD_GUILD_ID)
    ?.invites?.fetch();

  if (Array.isArray(invites)) {
    const sorted = invites.sort((a, b) => {
      if (a.uses < b.uses) return 1;
      if (a.uses > b.uses) return -1;
      return 0;
    });

    const filtered = sorted
      .map((invite) => {
        return {
          uses: invite?.uses,
          username: invite?.inviter?.username,
          userid: invite?.inviter?.id,
        };
      })
      ?.slice(0, 10);

    return filtered;
  } else {
    return [];
  }
};

module.exports = { getTop10Invites };
