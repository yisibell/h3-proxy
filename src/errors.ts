export enum ERRORS {
  ERR_CONFIG_FACTORY_TARGET_MISSING = '[h3-proxy] Missing "target" option. Example: {target: "http://www.example.org"}',
  ERR_CONTEXT_MATCHER_INVALID_ARRAY = '[h3-proxy] Invalid pathFilter. Expecting something like: ["/api", "/ajax"] or ["/api/**", "!**.html"]',
  ERR_PATH_REWRITER_CONFIG = '[h3-proxy] Invalid pathRewrite config. Expecting object with pathRewrite config or a rewrite function',
}