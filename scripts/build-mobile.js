const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api')
const apiBackup = path.join(__dirname, '..', '_api_backup')
const adminDir = path.join(__dirname, '..', 'src', 'app', 'admin')
const adminBackup = path.join(__dirname, '..', '_admin_backup')

try {
  // Move api and admin folders out (they use server-side features)
  if (fs.existsSync(apiDir)) fs.renameSync(apiDir, apiBackup)
  if (fs.existsSync(adminDir)) fs.renameSync(adminDir, adminBackup)

  // Build with static export
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, MOBILE_BUILD: 'true' },
  })
} finally {
  // Restore folders
  if (fs.existsSync(apiBackup)) fs.renameSync(apiBackup, apiDir)
  if (fs.existsSync(adminBackup)) fs.renameSync(adminBackup, adminDir)
}

console.log('\n✅ Mobile build complete! Output in ./out')
