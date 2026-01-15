# Test ayga-mcp-nodejs locally
# Run this before publishing to npm

Write-Host "🧪 Testing ayga-mcp-nodejs locally" -ForegroundColor Cyan
Write-Host ""

# Check if REDIS_API_KEY is set
if (-not $env:REDIS_API_KEY) {
    Write-Host "❌ REDIS_API_KEY not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:REDIS_API_KEY = 'your-key-here'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ REDIS_API_KEY is set" -ForegroundColor Green
Write-Host ""

# Build
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Test with list_parsers
Write-Host "🔍 Testing list_parsers..." -ForegroundColor Yellow
Write-Host ""

$testInput = @{
    jsonrpc = "2.0"
    id      = 1
    method  = "tools/list"
    params  = @{}
} | ConvertTo-Json -Depth 10

Write-Host "Input:" -ForegroundColor Gray
Write-Host $testInput -ForegroundColor Gray
Write-Host ""

$testInput | node dist/index.js | Select-Object -First 50

Write-Host ""
Write-Host "✅ Test complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update VS Code mcp.json:" -ForegroundColor White
Write-Host "     {" -ForegroundColor Gray
Write-Host "       `"ayga-nodejs`": {" -ForegroundColor Gray
Write-Host "         `"type`": `"stdio`"," -ForegroundColor Gray
Write-Host "         `"command`": `"node`"," -ForegroundColor Gray
Write-Host "         `"args`": [`"T:/Code/python/A-PARSER/ayga-mcp-nodejs/dist/index.js`"]," -ForegroundColor Gray
Write-Host "         `"env`": { `"REDIS_API_KEY`": `"YOUR_KEY`" }" -ForegroundColor Gray
Write-Host "       }" -ForegroundColor Gray
Write-Host "     }" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Reload VS Code window (Ctrl+Shift+P -> Reload Window)" -ForegroundColor White
Write-Host "  3. Test: @ayga-nodejs list_parsers" -ForegroundColor White
