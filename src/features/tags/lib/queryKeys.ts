export const tagKeys = {
  all: ["tags"] as const,
  stats: (params: {
    channel_ids?: Array<number | string> | null;
    include_virtual?: boolean;
  }) =>
    [
      ...tagKeys.all,
      "stats",
      {
        channel_ids: params.channel_ids,
        include_virtual: params.include_virtual,
      },
    ] as const,
};
