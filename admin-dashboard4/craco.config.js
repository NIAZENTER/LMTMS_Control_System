const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        aliases: {
          // 원하는 경우 여기에 별칭을 추가할 수 있습니다.
        },
      },
    },
  ],
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util/"),
          buffer: require.resolve("buffer/"),
        },
      },
    },
  },
};
