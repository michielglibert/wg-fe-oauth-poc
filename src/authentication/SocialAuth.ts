export const isSocialLoginUrl = Boolean(
  window.location.href.match(/\.campaigns|conversations\./)
);

export const isCampaignsUrl = Boolean(
  window.location.href.match(/\.campaigns\./)
);

export const isConversationUrl = Boolean(
  window.location.href.match(/conversations\./)
);
