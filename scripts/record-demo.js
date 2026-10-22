const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG_PATH = 'C:\\Users\\mayur\\AppData\\Local\\Microsoft\\WinGet\\Packages\\yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-N-125875-g5d4d3bdc61-win64-gpl\\bin\\ffmpeg.exe';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'elevate-ai-demo.mp4');
const FRAMES_DIR = path.join(__dirname, '..', 'temp_video_frames');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('--- Starting ElevateAI 20-Second Intro Video Generation ---');

  if (fs.existsSync(FRAMES_DIR)) {
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1280,720',
      '--disable-gpu',
      '--hide-scrollbars'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

  console.log('Navigating to live application...');
  await page.goto('https://elevate-your-career.vercel.app', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await sleep(1500);

  // Inject sleek modern video overlays: Virtual Mouse Cursor + Lower-Third Caption Card
  await page.evaluate(() => {
    // 1. Virtual Animated Cursor
    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.innerHTML = `
      <div style="position:relative;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));">
          <path d="M4 3L11 21L14 14L21 11L4 3Z" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <div id="demo-cursor-ripple" style="position:absolute; top:2px; left:2px; width:20px; height:20px; border-radius:50%; background:rgba(37,99,235,0.4); transform:scale(0); opacity:0; transition: transform 0.3s ease-out, opacity 0.3s ease-out;"></div>
      </div>
    `;
    cursor.style.cssText = 'position:fixed; top:120px; left:200px; z-index:999999; pointer-events:none; transition: top 0.4s cubic-bezier(0.25, 1, 0.5, 1), left 0.4s cubic-bezier(0.25, 1, 0.5, 1);';
    document.body.appendChild(cursor);

    // 2. Lower-Third Caption Overlay Card (LinkedIn SaaS Style)
    const caption = document.createElement('div');
    caption.id = 'demo-caption-card';
    caption.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999998;
      pointer-events: none;
      background: rgba(15, 23, 42, 0.90);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
      border-radius: 16px;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      gap: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.3s ease;
      min-width: 520px;
      max-width: 85%;
    `;
    caption.innerHTML = `
      <div id="demo-caption-tag" style="padding: 4px 10px; border-radius: 999px; background: rgba(37,99,235,0.25); border: 1px solid rgba(96,165,250,0.4); color: #60A5FA; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">
        FEATURE 1/5
      </div>
      <div style="flex: 1;">
        <div id="demo-caption-title" style="color: #FFFFFF; font-size: 14px; font-weight: 700; line-height: 1.2;">
          ElevateAI — Intelligent Resume Job Matcher
        </div>
        <div id="demo-caption-sub" style="color: #94A3B8; font-size: 11px; margin-top: 2px;">
          Find jobs fitted to your resume & unlock roles paying +35% with 1 skill
        </div>
      </div>
    `;
    document.body.appendChild(caption);

    // Helper functions exposed in browser context
    window.setDemoCursor = (x, y, click = false) => {
      const cur = document.getElementById('demo-cursor');
      if (cur) {
        cur.style.left = `${x}px`;
        cur.style.top = `${y}px`;
        if (click) {
          const rip = document.getElementById('demo-cursor-ripple');
          if (rip) {
            rip.style.transform = 'scale(2.4)';
            rip.style.opacity = '1';
            setTimeout(() => {
              rip.style.transform = 'scale(0)';
              rip.style.opacity = '0';
            }, 300);
          }
        }
      }
    };

    window.setDemoCaption = (tag, title, sub) => {
      const t = document.getElementById('demo-caption-tag');
      const h = document.getElementById('demo-caption-title');
      const s = document.getElementById('demo-caption-sub');
      if (t) t.innerText = tag;
      if (h) h.innerText = title;
      if (s) s.innerText = sub;
    };
  });

  const client = await page.target().createCDPSession();
  let frameIndex = 0;
  const targetFps = 30;
  const totalDurationSec = 20;
  const totalTargetFrames = targetFps * totalDurationSec; // 600 frames

  console.log(`Starting screencast recording (${totalDurationSec}s @ ${targetFps}fps = ${totalTargetFrames} frames)...`);

  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    if (frameIndex < totalTargetFrames) {
      const filename = path.join(FRAMES_DIR, `frame_${String(frameIndex).padStart(5, '0')}.jpg`);
      fs.writeFileSync(filename, Buffer.from(data, 'base64'));
      frameIndex++;
    }
    await client.send('Page.screencastFrameAck', { sessionId });
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 85,
    maxWidth: 1280,
    maxHeight: 720,
    everyNthFrame: 1
  });

  // Automated Timeline Execution (20 Seconds Total)
  // Step 1: 0.0s - 3.5s (Hero section overview)
  console.log('[0.0s - 3.5s] Hero Overview & Dropzone...');
  await page.evaluate(() => {
    window.setDemoCaption(
      'AI Career Studio',
      'Find Jobs Fitted to Your Resume',
      'Next-Gen autonomous resume-to-job matching & market intelligence'
    );
    window.setDemoCursor(640, 240);
  });
  await sleep(1500);

  // Move cursor toward sample resumes
  await page.evaluate(() => {
    window.setDemoCursor(680, 420);
  });
  await sleep(1800);

  // Step 2: 3.5s - 7.5s (Click Sarah Chen Full-Stack Dev)
  console.log('[3.5s - 7.5s] Click Full-Stack Sample & Instant Skill Extraction...');
  await page.evaluate(() => {
    window.setDemoCaption(
      'Strict Resume Engine',
      'Instant Resume Parsing & Structural Verification',
      'Strictly rejects transit tickets & invoices · Extracts authentic skills'
    );
    // Find Full-Stack Dev button
    const buttons = Array.from(document.querySelectorAll('button'));
    const fsBtn = buttons.find(b => b.textContent && b.textContent.includes('Full-Stack'));
    if (fsBtn) {
      const rect = fsBtn.getBoundingClientRect();
      window.setDemoCursor(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
      fsBtn.click();
    }
  });
  await sleep(1500);

  // Hover over the extracted profile summary bar
  await page.evaluate(() => {
    window.setDemoCursor(320, 510);
  });
  await sleep(2200);

  // Step 3: 7.5s - 12.0s (Scroll to Direct Job Matches)
  console.log('[7.5s - 12.0s] Scrolling to Direct Job Matches...');
  await page.evaluate(() => {
    window.setDemoCaption(
      'Live Matching',
      'Dynamic Job Matches & Circular Fit Gauges',
      'Truthful match scores (85%-92%) · No artificial floors · Why You Fit AI'
    );
  });

  // Smooth scroll down to Job Matches
  for (let i = 0; i < 25; i++) {
    await page.evaluate(() => window.scrollBy(0, 18));
    await sleep(40);
  }

  // Hover over first job card (Senior Full Stack Engineer)
  await page.evaluate(() => {
    window.setDemoCursor(480, 360);
  });
  await sleep(1500);

  // Hover over Tailor Pitch button
  await page.evaluate(() => {
    const pitchBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Tailor Pitch'));
    if (pitchBtns.length > 0) {
      const r = pitchBtns[0].getBoundingClientRect();
      window.setDemoCursor(r.left + r.width / 2, r.top + r.height / 2, true);
    }
  });
  await sleep(1800);

  // Step 4: 12.0s - 16.5s (Switch to 1-Skill Unlocks tab)
  console.log('[12.0s - 16.5s] Switching to 1-Skill Unlocks Engine...');
  // Scroll up to navbar
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, -22));
    await sleep(35);
  }

  await page.evaluate(() => {
    window.setDemoCaption(
      'High-ROI Engine',
      'The "1-Skill Unlock" Opportunity Engine',
      'Pinpoint the 1 or 2 tools between you & a +$65,000/yr salary boost'
    );
    const navBtns = Array.from(document.querySelectorAll('nav button, button'));
    const unlockBtn = navBtns.find(b => b.textContent && b.textContent.includes('1-Skill Unlocks'));
    if (unlockBtn) {
      const rect = unlockBtn.getBoundingClientRect();
      window.setDemoCursor(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
      unlockBtn.click();
    }
  });
  await sleep(1800);

  // Scroll slightly down to showcase bridge plan & portfolio proof
  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 16));
    await sleep(40);
  }
  await page.evaluate(() => {
    window.setDemoCursor(550, 420);
  });
  await sleep(1600);

  // Step 5: 16.5s - 19.5s (Open Zara AI Career Coach Drawer)
  console.log('[16.5s - 19.5s] Opening Zara AI Coach Drawer...');
  await page.evaluate(() => {
    window.setDemoCaption(
      'Zara AI Coach',
      'Zara — Your AI Career Strategist & Coach',
      'Personalized 30-day bridge schedules, mock interview loops & resume tips'
    );
    const zaraBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Ask Zara AI'));
    if (zaraBtn) {
      const rect = zaraBtn.getBoundingClientRect();
      window.setDemoCursor(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
      zaraBtn.click();
    }
  });
  await sleep(2500);

  // Step 6: 19.5s - 20.5s (Outro slide overlay)
  console.log('[19.5s - 20.5s] Outro Call-To-Action...');
  await page.evaluate(() => {
    const outro = document.createElement('div');
    outro.id = 'demo-outro-overlay';
    outro.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999999;
      background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      text-align: center;
      padding: 30px;
      opacity: 0;
      transition: opacity 0.5s ease;
    `;
    outro.innerHTML = `
      <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #2563EB, #4F46E5); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(37,99,235,0.4);">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <h1 style="font-size: 38px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: -0.5px;">
        Elevate<span style="color: #60A5FA;">AI</span>
      </h1>
      <p style="font-size: 16px; color: #94A3B8; max-width: 500px; margin: 0 0 24px 0; line-height: 1.4;">
        Find Jobs Fitted to Your Resume. Unlock High-Paying Roles With Just 1 Skill.
      </p>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="padding: 10px 20px; border-radius: 12px; background: #2563EB; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
          🚀 elevate-your-career.vercel.app
        </div>
      </div>
      <div style="color: #64748B; font-size: 13px;">
        Open Source on GitHub · Free &amp; Instant Access
      </div>
    `;
    document.body.appendChild(outro);
    requestAnimationFrame(() => {
      outro.style.opacity = '1';
    });
  });
  await sleep(1500);

  // Stop recording
  await client.send('Page.stopScreencast');
  await browser.close();

  console.log(`Recorded ${frameIndex} frames to ${FRAMES_DIR}.`);

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

  // Encode frames to MP4 using ffmpeg
  console.log('Encoding frames to MP4 with ffmpeg (H.264 / AAC)...');
  const ffmpegArgs = [
    '-y',
    '-framerate', String(targetFps),
    '-i', path.join(FRAMES_DIR, 'frame_%05d.jpg'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'slow',
    '-crf', '19',
    '-movflags', '+faststart',
    OUTPUT_FILE
  ];

  await new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_PATH, ffmpegArgs);
    proc.stderr.on('data', d => {
      // console.log(d.toString());
    });
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  // Also copy to root for easy user access
  const rootVideoPath = path.join(__dirname, '..', 'elevate-ai-demo.mp4');
  fs.copyFileSync(OUTPUT_FILE, rootVideoPath);

  const stats = fs.statSync(OUTPUT_FILE);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Success! Video created: ${OUTPUT_FILE} (${sizeMb} MB)`);
  console.log(`✅ Root copy created: ${rootVideoPath}`);

  // Clean up frames
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  console.log('Cleaned up temporary frames.');
}

run().catch(err => {
  console.error('Fatal error during video generation:', err);
  process.exit(1);
});
