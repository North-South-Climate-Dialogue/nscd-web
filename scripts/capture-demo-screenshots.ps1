# Headless Edge screenshots for every page in the demo doc.
# Run from the project root while the dev server is live on :3000.
#
# Edge needs absolute paths for --screenshot — relative ones silently fail.
# We pre-warm each route via curl so Next has finished its on-demand compile
# before Edge tries to render, then give Edge a generous virtual-time-budget.

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = Join-Path (Get-Location) "demo\screenshots"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$pages = @(
  @{ id = "home";              path = "/" },
  @{ id = "about";             path = "/about" },
  @{ id = "contact";           path = "/contact" },
  @{ id = "events";            path = "/events" },
  @{ id = "glossary";          path = "/learning/glossary" },
  @{ id = "glossary-detail";   path = "/learning/glossary?sel=climate" },
  @{ id = "pinyin-guide";      path = "/learning/pinyin-guide" },
  @{ id = "flashcards";        path = "/learning/flashcards" },
  @{ id = "quiz";              path = "/quiz" },
  @{ id = "blog";              path = "/blog" },
  @{ id = "blog-post";         path = "/blog/cityhive-shifting-systems-2025" },
  @{ id = "signup";            path = "/signup" },
  @{ id = "login";             path = "/login" },
  @{ id = "account";           path = "/account" },
  @{ id = "account-profile";   path = "/account/profile" },
  @{ id = "account-goals";     path = "/account/goals" },
  @{ id = "account-progress";  path = "/account/progress" },
  @{ id = "account-matching";  path = "/account/matching" }
)

foreach ($p in $pages) {
  $url = "http://localhost:3000" + $p.path
  $out = Join-Path $outDir "$($p.id).png"
  Write-Host "Capturing $($p.id) -> $url"

  # Pre-warm so Next compiles the route. Two requests to make sure assets are hot.
  try { Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 | Out-Null } catch {}
  Start-Sleep -Milliseconds 500
  try { Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 | Out-Null } catch {}

  & $edge --headless --disable-gpu --no-sandbox --hide-scrollbars `
    "--screenshot=$out" `
    "--window-size=1400,900" `
    "--virtual-time-budget=10000" `
    $url 2>$null | Out-Null

  if (Test-Path $out) {
    $bytes = (Get-Item $out).Length
    Write-Host "  saved $([math]::Round($bytes/1024,1))KB"
  } else {
    Write-Host "  FAILED"
  }
}

Write-Host "Done."
