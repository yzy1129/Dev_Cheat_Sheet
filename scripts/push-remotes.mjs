import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const onlyArg = args.find((arg) => arg.startsWith("--only="));
const branchArg = args.find((arg) => !arg.startsWith("--"));
const dryRun = args.includes("--dry-run");
const showHelp = args.includes("--help") || args.includes("-h");

const allRemotes = ["origin", "gitee"];
const remotes = onlyArg ? [onlyArg.split("=")[1]] : allRemotes;

if (showHelp) {
  console.log("Usage: node scripts/push-remotes.mjs [branch] [--only=origin|gitee] [--dry-run]");
  console.log("Examples:");
  console.log("  npm run push:gitee");
  console.log("  npm run push:gitee -- main");
  console.log("  npm run push:all -- main");
  console.log("  npm run push:all -- --dry-run");
  process.exit(0);
}

if (remotes.some((remote) => !allRemotes.includes(remote))) {
  console.error(`Unsupported remote. Use one of: ${allRemotes.join(", ")}`);
  process.exit(1);
}

function runGit(argsToRun, options = {}) {
  const result = spawnSync("git", argsToRun, {
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    if (options.capture) {
      const stderr = result.stderr?.trim();
      if (stderr) {
        console.error(stderr);
      }
    }
    process.exit(result.status ?? 1);
  }

  return options.capture ? result.stdout.trim() : "";
}

function remoteExists(remote) {
  const result = spawnSync("git", ["remote", "get-url", remote], {
    stdio: "ignore",
    shell: process.platform === "win32",
  });

  return result.status === 0;
}

const branch = branchArg || runGit(["rev-parse", "--abbrev-ref", "HEAD"], { capture: true });

if (!branch || branch === "HEAD") {
  console.error("Unable to determine the current branch. Pass one explicitly, for example: npm run push:all -- main");
  process.exit(1);
}

for (const remote of remotes) {
  if (!remoteExists(remote)) {
    console.error(`Remote "${remote}" does not exist in this repository.`);
    process.exit(1);
  }
}

for (const remote of remotes) {
  console.log(`Pushing ${branch} -> ${remote}`);
  const pushArgs = dryRun ? ["push", "--dry-run", remote, branch] : ["push", remote, branch];
  runGit(pushArgs);
}

console.log(dryRun ? "Dry-run completed." : "Push completed.");
