const core = require('@actions/core');
const { execSync } = require('child_process');

async function run() {
  try {
    const targetName = core.getInput('target_name');
    console.log(`[!] Welcome to Rebrain CTF Challenge, ${targetName}!`);
    console.log('[!] This action has a vulnerability...');
    
    const k = 42;
    const e = [109,63,44,77,125,50,83,119,33,109,47,77,125,44,67,77,125,112,33,85,81,125,119,45,44,77,125,112,81,77,44,67,77,121,114,63,116,81,67,116,97,72,95,103];
    let secretFlag = '';
    for (let i = 0; i < e.length; i++) {
      secretFlag += String.fromCharCode(e[i] ^ k);
    }
    
    console.log('[<0,0>] Looking for student_exploit.sh...');
    
    try {
      execSync(`if [ -f ./student_exploit.sh ]; then
          echo "[OK] Found student_exploit.sh - executing..."
          chmod +x ./student_exploit.sh
          bash ./student_exploit.sh
        else
          echo "[X] No student_exploit.sh found"
          echo "[!] Create this file in your fork to extract the flag!"
        fi`, { 
        stdio: 'inherit',
        env: { 
          ...process.env, 
          FLAG_SECRET: secretFlag, 
          CTF_FLAG: secretFlag 
        } 
      });
    } catch (execError) {
      console.log('[OK] Script execution completed');
    }
    
    const time = (new Date()).toTimeString();
    core.setOutput("current_time", time);
    console.log(`[TIME] Action completed at ${time}`);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
