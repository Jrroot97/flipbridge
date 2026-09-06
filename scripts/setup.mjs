import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import net from "node:net";

if (!existsSync(".env")) {
  copyFileSync(".env.example", ".env");
}

for (const line of readFileSync(".env", "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq);
  const value = trimmed.slice(eq + 1).replace(/^"(.*)"$/, "$1");
  if (!process.env[key]) process.env[key] = value;
}

function hasDocker() {
  return spawnSync("docker", ["compose", "version"], { encoding: "utf8" }).status === 0;
}

function dockerUp() {
  if (!hasDocker() || !existsSync("docker-compose.yml")) return;
  console.log("Starting Postgres with docker compose…");
  execSync("docker compose up -d", { stdio: "inherit" });
}

function waitForPort(host, port, retries = 40) {
  return new Promise((resolve, reject) => {
    const tryConnect = (attempt) => {
      const socket = net.connect({ host, port });
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (attempt >= retries) {
          reject(
            new Error(
              `Could not reach Postgres at ${host}:${port}. Run \`docker compose up -d\` or set DATABASE_URL.`,
            ),
          );
          return;
        }
        setTimeout(() => tryConnect(attempt + 1), 500);
      });
    };
    tryConnect(1);
  });
}

function databaseHost() {
  const url = process.env.DATABASE_URL ?? "";
  try {
    return new URL(url);
  } catch {
    return new URL("postgresql://127.0.0.1:5432/flipbridge");
  }
}

dockerUp();
execSync("npx prisma generate", { stdio: "inherit" });

const db = databaseHost();
await waitForPort(db.hostname || "127.0.0.1", Number(db.port || 5432));

execSync("npx prisma migrate deploy", { stdio: "inherit" });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
