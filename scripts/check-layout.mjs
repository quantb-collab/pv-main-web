import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

/**
 * ============================================================================
 * SOÁT TRÀN NGANG
 * ----------------------------------------------------------------------------
 * Một trang cuộn ngang được là hỏng, không phải là "chưa đẹp": người dùng chạm
 * kéo được cả trang lệch đi, và không có cách nào đưa nó về ngoài việc kéo
 * ngược lại. `next build` không bắt được — bố cục tràn vẫn là TypeScript hợp lệ
 * và CSS hợp lệ.
 *
 * Trang chủ đã sống với lỗi này ở MỌI bề ngang dưới 1024px (đo 2026-08-17:
 * scrollWidth 1 108 trong khung 360). Nó lọt qua vì chưa ai đo, nên phép đo là
 * thứ duy nhất giữ nó không quay lại.
 *
 * Cách chạy: tự dựng `next start` trên cổng riêng, mở từng trang khai trong
 * `src/content/registry.ts`, đo `scrollWidth` ở bốn mốc breakpoint của hệ, rồi
 * tắt server. Cần `next build` chạy trước — `pnpm verify` đã lo thứ tự đó.
 *
 * Chạy riêng:  pnpm check:layout
 * Đo trang đang mở sẵn:  PV_BASE=http://localhost:3000 pnpm check:layout
 * ============================================================================
 */

/* Bốn mốc, đúng bốn vai trò trong docs/DESIGN-TOKENS.md § Thang màn hình.
   360 là máy hẹp nhất còn đáng đỡ; 1024 là chỗ bố cục desktop vừa bật, tức
   chỗ dễ vỡ nhất chứ không phải chỗ an toàn nhất. */
const WIDTHS = [360, 768, 1024, 1440];
const HEIGHT = 900;
const PORT = 4311;
const MAX_PAGES = 40;
const CHROME =
  process.env.PV_CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const external = process.env.PV_BASE;
const base = external ?? `http://localhost:${PORT}`;

let server;
let chrome;
let ws;
let msgId = 0;
const pending = new Map();

const fail = (msg) => {
  console.error(msg);
  process.exitCode = 1;
};

async function waitFor(url, tries = 120) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status === 307 || r.status === 404) return true;
    } catch {
      /* chưa lên */
    }
    await sleep(250);
  }
  return false;
}

function send(method, params = {}, sessionId) {
  return new Promise((res, rej) => {
    const msg = { id: ++msgId, method, params };
    if (sessionId) msg.sessionId = sessionId;
    pending.set(msg.id, { res, rej });
    ws.send(JSON.stringify(msg));
  });
}

try {
  if (!external) {
    server = spawn("pnpm", ["exec", "next", "start", "-p", String(PORT)], {
      stdio: "ignore",
    });
    if (!(await waitFor(`${base}/vi`))) {
      fail("✗ next start không lên được — đã chạy `next build` chưa?");
      process.exit(1);
    }
  }

  /* Danh sách trang đọc thẳng từ registry, không viết cứng ở đây: luật 1 của
     repo nói registry là nguồn sự thật về cấu trúc site, nên trang mới tự được
     soát mà không ai phải nhớ thêm nó vào script này.

     KHÔNG dùng `/sitemap.xml`: sitemap lọc theo `status`, mà cả site đang ở
     `wireframe`/`stub` nên nó rỗng — soát theo sitemap là soát đúng 0 trang. */
  const registry = await readFile("src/content/registry.ts", "utf8");
  const paths = [
    ...new Set([...registry.matchAll(/^\s*path:\s*"([^"]*)"/gm)].map((m) => m[1])),
  ];
  const all = paths.map((p) => `/vi${p === "/" ? "" : p}`).sort();
  const wanted = ["/vi", ...all.filter((p) => p !== "/vi")];
  const routes = wanted.slice(0, MAX_PAGES);
  /* Cắt bớt thì nói ra. Một trần âm thầm đọc ra là "đã soát hết". */
  if (wanted.length > routes.length) {
    console.log(
      `  (registry có ${wanted.length} trang, soát ${routes.length} — nâng MAX_PAGES nếu muốn hết)`,
    );
  }

  chrome = spawn(
    CHROME,
    [
      "--headless=new",
      `--remote-debugging-port=${PORT + 1}`,
      `--window-size=${WIDTHS.at(-1)},${HEIGHT}`,
      "--hide-scrollbars",
      "--no-first-run",
      `--user-data-dir=/tmp/pv-check-layout`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let target;
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT + 1}/json/version`);
      if (r.ok) {
        target = (await r.json()).webSocketDebuggerUrl;
        break;
      }
    } catch {
      /* chưa lên */
    }
    await sleep(250);
  }
  if (!target) {
    fail(`✗ không mở được Chrome ở ${CHROME} — đặt PV_CHROME nếu máy khác chỗ.`);
    process.exit(1);
  }

  ws = new WebSocket(target);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      if (m.error) p.rej(new Error(m.error.message));
      else p.res(m.result);
    }
  };

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  const S = (m, p) => send(m, p, sessionId);
  await S("Page.enable");
  await S("Runtime.enable");

  const bad = [];
  for (const route of routes) {
    await S("Page.navigate", { url: base + route });
    await sleep(1200);
    for (const width of WIDTHS) {
      await S("Emulation.setDeviceMetricsOverride", {
        width,
        height: HEIGHT,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await sleep(450);
      const { result } = await S("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const de = document.documentElement;
          /* Thủ phạm = phần tử NGOÀI CÙNG chạm mép phải quá khung. Báo đúng nó
             thì người sửa không phải dò 128 phần tử con của nó. */
          let who = null;
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width && r.right > de.clientWidth + 1) {
              if (!who || !who.contains(el)) who = el;
            }
          }
          const name = who
            ? who.tagName.toLowerCase() +
              (who.id ? '#' + who.id : '') +
              (typeof who.className === 'string' && who.className
                ? '.' + who.className.trim().split(/\\s+/).slice(0, 3).join('.')
                : '')
            : '?';
          return { sw: de.scrollWidth, cw: de.clientWidth, who: name };
        })()`,
      });
      const { sw, cw, who } = result.value;
      if (sw > cw + 1) bad.push({ route, width, over: sw - cw, who });
    }
  }

  if (bad.length) {
    console.error(`\n✗ ${bad.length} chỗ tràn ngang:\n`);
    for (const b of bad) {
      console.error(`  ${b.route} @${b.width}px  tràn +${b.over}px`);
      console.error(`    thủ phạm ngoài cùng: ${b.who}`);
    }
    console.error(
      `\n  Gần như luôn là một mắt xích \`min-width: auto\` chưa mở:\n` +
        `  grid không khai template thì cột ngầm rộng bằng min-content của con,\n` +
        `  và flex/grid item mặc định không co dưới min-content. Mở bằng\n` +
        `  \`grid-cols-[minmax(0,1fr)]\` hoặc \`min-w-0\` — TRÊN MỌI tổ tiên giữa\n` +
        `  khung và băng cuộn, thiếu một mắt là chuỗi vẫn đứt.\n`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `✓ ${routes.length} trang × ${WIDTHS.length} khổ (${WIDTHS.join(" · ")}) — không trang nào cuộn ngang.`,
    );
  }
} finally {
  chrome?.kill();
  server?.kill();
}
