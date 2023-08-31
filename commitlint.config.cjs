module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["Feat!", "Feat", "Fix", "Patch", "Chore", "Build", "Debug", "Refactor", "Revert", "CI", "Perf",  "Test", "Docs", "WIP"]
    ],
    "type-case": [0],
    "subject-case": [0],
    "footer-max-line-length": [0],
  }
};
